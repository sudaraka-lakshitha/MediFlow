import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { X509Certificate } from 'node:crypto';

if (process.argv.includes('--help')) {
  console.log('Run npm run setup:admin in an interactive terminal. Optionally provide --certificate "C:/path/to/aiven-ca.pem". You will be asked for your Aiven DATABASE_URL, downloaded CA certificate path (unless supplied), administrator email, and password. No .env file is changed. Existing administrator accounts are never replaced.');
  process.exit(0);
}

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  console.error('Open PowerShell or another interactive terminal to run this command.');
  process.exit(1);
}

let muted = false;
const output = new Writable({
  write(chunk, encoding, callback) {
    if (!muted) process.stdout.write(chunk, encoding);
    callback();
  },
});
const terminal = createInterface({ input: process.stdin, output, terminal: true });
terminal.on('SIGINT', () => {
  process.stdout.write('\nSetup cancelled.\n');
  terminal.close();
  process.exit(130);
});

async function ask(label, hidden = false) {
  while (true) {
    muted = false;
    // Let readline render and retain the prompt before hiding input echoes.
    // An empty readline prompt can erase a separately printed label on redraw.
    const answer = terminal.question(label);
    muted = hidden;
    let value;
    try {
      value = await answer;
    } finally {
      muted = false;
      if (hidden) process.stdout.write('\n');
    }
    if (value.trim()) return value;
    console.log('No value received. Enter the requested value and press Enter.');
  }
}

let prisma;
try {
  const [{ default: bcrypt }, { PrismaClient }, { staffSchema }] = await Promise.all([
    import('bcrypt'),
    import('@prisma/client'),
    import('../src/validators/auth.validator.js'),
  ]);
  console.log('Create the first MediFlow administrator in Aiven.');
  console.log('Paste your Render DATABASE_URL at the first prompt. Input will be hidden.');
  const rawUrl = (await ask('Aiven DATABASE_URL: ', true)).trim();
  let url;
  try { url = new URL(rawUrl); }
  catch { throw new Error('Enter a valid MySQL connection URL.'); }
  if (url.protocol !== 'mysql:' || !url.hostname.endsWith('.aivencloud.com') || !url.username || !url.password || url.pathname.length < 2) {
    throw new Error('Enter your complete Aiven MySQL URL, including username, password, host, and database.');
  }

  const certificateArgument = process.argv.indexOf('--certificate');
  if (certificateArgument !== -1 && !process.argv[certificateArgument + 1]) {
    throw new Error('Supply a file path after --certificate.');
  }
  const certificateInput = (certificateArgument === -1
    ? await ask('Downloaded Aiven CA certificate path (you can paste a quoted path): ')
    : process.argv[certificateArgument + 1]).trim().replace(/^"(.*)"$/, '$1');
  if (!certificateInput) throw new Error('A certificate file path is required.');
  const certificatePath = resolve(certificateInput);
  try {
    new X509Certificate(await readFile(certificatePath));
  } catch {
    throw new Error('Cannot read a valid certificate at that path. Download the CA certificate from this Aiven service and try again.');
  }
  url.searchParams.set('sslcert', certificatePath.replaceAll('\\', '/'));
  url.searchParams.set('sslaccept', 'strict');
  url.searchParams.set('connection_limit', '1');
  console.log(`Database destination: ${url.hostname}${url.pathname}`);

  const email = (await ask('Administrator email: ')).trim();
  const password = await ask('New password (16+ characters, uppercase, lowercase, number, symbol): ', true);
  const repeatedPassword = await ask('Repeat password: ', true);
  if (password !== repeatedPassword) throw new Error('Passwords do not match. Run setup again.');
  if (password.length < 16 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('Use at least 16 characters and no more than 72 UTF-8 bytes for the password.');
  }
  const parsed = staffSchema.safeParse({ fullName: 'System Administrator', email, password, role: 'ADMIN' });
  if (!parsed.success) throw new Error(parsed.error.issues.map((issue) => issue.message).join('\n'));

  prisma = new PrismaClient({ datasourceUrl: url.toString() });
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.$transaction(async (tx) => {
    if (await tx.user.count({ where: { role: 'ADMIN' } })) {
      throw new Error('An administrator already exists. Sign in with that account or use password recovery.');
    }
    const { password: unusedPassword, ...profile } = parsed.data;
    await tx.user.create({ data: { ...profile, passwordHash, mustChangePassword: true } });
  }, { isolationLevel: 'Serializable' });
  console.log('Administrator created successfully. Sign in on your Vercel website and change the password when prompted.');
} catch (error) {
  if (error.code === 'ERR_MODULE_NOT_FOUND') {
    console.error('Install backend dependencies and generate Prisma Client first: npm ci --include=dev, then npm run prisma:generate.');
  } else if (error.code) {
    console.error(`Setup failed (${error.code}). Check your Aiven connection, certificate, network access, and that Render migrations completed successfully.`);
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
} finally {
  terminal.close();
  if (prisma) await prisma.$disconnect();
}

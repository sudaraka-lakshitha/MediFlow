import { expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
vi.mock('../src/middleware/authenticate.js', () => ({ authenticate: (req, res, next) => {
  const role = req.get('x-test-role'); if (!role) return res.sendStatus(401); req.user = { id: 7, role }; next();
} }));
vi.mock('../src/middleware/workflowLease.js', () => ({ withWorkflowLease: handler => handler }));
vi.mock('../src/services/delivery.service.js', () => ({ deliveryService: { list: vi.fn().mockResolvedValue([]), request: vi.fn(), act: vi.fn() } }));
import { deliveryRoutes } from '../src/routes/delivery.routes.js';
const app = express(); app.use(express.json()); app.use('/api', deliveryRoutes);
app.get('/api/auth/public-check', (_req, res) => res.sendStatus(200));
app.use((error, _req, res, _next) => res.status(error.statusCode || 400).json({ message: error.message }));
it('does not apply delivery authentication to public authentication routes', async () => {
  expect((await request(app).get('/api/auth/public-check')).status).toBe(200);
});
it('requires authentication for delivery listings', async () => {
  expect((await request(app).get('/api/deliveries')).status).toBe(401);
});
it('allows a patient to list their deliveries', async () => {
  expect((await request(app).get('/api/deliveries').set('x-test-role', 'PATIENT')).status).toBe(200);
});
it('does not let patients dispatch', async () => {
  expect((await request(app).put('/api/payment-requests/1/delivery').set('x-test-role', 'PATIENT').send({ action: 'DISPATCH' })).status).toBe(403);
});
it('rejects dispatch without a courier and tracking reference', async () => {
  expect((await request(app).put('/api/payment-requests/1/delivery').set('x-test-role', 'PHARMACIST').send({ action: 'DISPATCH' })).status).toBe(400);
});

UPDATE "prescriptions"
SET
  "prescriber_title" = CASE
    WHEN "prescriber_name" ~* '^dr\.?\s+' THEN 'Dr.'
    WHEN "prescriber_name" ~* '^prof\.?\s+' THEN 'Prof.'
    WHEN "prescriber_name" ~* '^mr\.?\s+' THEN 'Mr.'
    WHEN "prescriber_name" ~* '^mrs\.?\s+' THEN 'Mrs.'
    WHEN "prescriber_name" ~* '^ms\.?\s+' THEN 'Ms.'
    WHEN "prescriber_name" ~* '^rev\.?\s+' THEN 'Rev.'
    ELSE "prescriber_title"
  END,
  "prescriber_name" = btrim(
    regexp_replace(
      "prescriber_name",
      '^(dr|prof|mr|mrs|ms|rev)\.?\s+',
      '',
      'i'
    )
  )
WHERE
  "prescriber_title" IS NULL
  AND "prescriber_name" ~* '^(dr|prof|mr|mrs|ms|rev)\.?\s+';

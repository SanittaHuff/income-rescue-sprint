# Captain User Testing — Coach Mode v37

Purpose: verify the preserved private MVP in a real browser without changing production data or performing any external action.

## Before testing
- Use `resume-product-primary-private-mvp-v37.html` only.
- Do not upload real confidential documents during this test.
- Use clearly fictional test text.
- No application, email, publishing, payment, or external submission occurs.

## Test sequence
Complete one screen at a time. Stop and record the issue if any expected result is missing.

1. **Open and orient**
   - Open the HTML file in a desktop browser.
   - Confirm the page title and four-step workflow are visible.
   - Expected: no warning, blank page, or broken layout.

2. **Keyboard-only navigation**
   - Put the mouse aside.
   - Press Tab through the page, Shift+Tab backward, Enter/Space on buttons and checkboxes.
   - Expected: focus is always visible; no keyboard trap; controls activate correctly.

3. **200% zoom and reflow**
   - Set browser zoom to 200%.
   - Move through all four workflow screens.
   - Expected: no horizontal scrolling for primary workflow content, clipped text, overlap, or hidden controls.

4. **Read Aloud / screen-reader sequence**
   - Use the available Read Aloud or screen-reader feature.
   - Expected: headings, labels, instructions, status updates, and error messages are announced in a useful order.

5. **Governed workflow**
   - Enter fictional evidence, source, confidence, statement, and role lane.
   - Complete certification, resume assembly, job matching, and the four review checks.
   - Expected: unsupported claims are blocked; job-description text never becomes evidence; export stays locked until prerequisites and all checks are complete.

6. **Backup and restore**
   - Create a session backup.
   - Change one field.
   - Load the backup, review the preview, Cancel once, then repeat and Confirm restore.
   - Expected: Cancel preserves current work and returns focus; Confirm restores only after explicit confirmation.

7. **Privacy reset**
   - Use the privacy reset and confirm it.
   - Expected: locally stored evidence, certified statements, review state, and audit history are cleared.

## Pass standard
A test passes only when the expected result is directly observed. Do not infer a pass.

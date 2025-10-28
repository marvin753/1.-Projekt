# How to Set Development as Default Branch

## GitHub Web Interface (Recommended)

1. Go to your repository: https://github.com/marvin753/1.-Projekt
2. Click on **Settings** (top right)
3. In the left sidebar, click **Branches**
4. Under "Default branch", click the switch icon or edit button
5. Select **Development** from the dropdown
6. Click **Update**
7. Confirm the change

## GitHub CLI (If Authenticated)

```bash
gh auth login
gh repo edit marvin753/1.-Projekt --default-branch Development
```

## Current Status

- Default branch: main (change to Development)
- Active branch locally: Development
- Both branches are pushed to GitHub

## Benefits of Development as Default

- Protects main from accidental commits
- Encourages pull request workflow
- Better code review process
- Clearer separation of stable vs development code


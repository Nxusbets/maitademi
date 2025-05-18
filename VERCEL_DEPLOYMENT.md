# Deploying to Vercel

This guide will help you deploy your Maitademi Project to Vercel.

## Prerequisites

- Your project code should be stored in a Git repository (GitHub, GitLab, or Bitbucket)
- A Vercel account (sign up at https://vercel.com if you don't have one)

## Deployment Steps

1. **Prepare your project for deployment**
   - Make sure your project builds correctly locally
   - Ensure you have a `package.json` file with proper build commands

2. **Push your code to a Git repository**
   - If you haven't already, initialize a Git repository in your project folder:
     ```
     git init
     git add .
     git commit -m "Initial commit"
     ```
   - Create a repository on GitHub/GitLab/Bitbucket
   - Add the remote repository URL (replace with your actual repository URL):
     ```
     git remote add origin https://github.com/yourusername/your-repo-name.git
     ```
   - Verify the remote was added correctly:
     ```
     git remote -v
     ```
   - Check your current branch name:
     ```
     git branch
     ```
   - Push your code to the repository using your current branch name:
     ```
     git push -u origin your-branch-name
     ```
     
   - If you're using the "master" branch:
     ```
     git push -u origin master
     ```
   - Or if you want to use the "main" branch instead:
     ```
     git branch -M main
     git push -u origin main
     ```

   - **Troubleshooting Git Push Issues:**
     - If you see `fatal: 'origin' does not appear to be a git repository`, it means your remote isn't set up properly. Use:
       ```
       git remote add origin https://github.com/yourusername/your-repo-name.git
       ```
     - If you see `fatal: The current branch master has no upstream branch`, make sure to use the `-u` flag:
       ```
       git push -u origin master
       ```
     - To verify your remotes are correctly configured:
       ```
       git remote -v
       ```

3. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Configure your project settings:
     - Framework preset: Select your framework (React, Next.js, etc.)
     - Build command: Usually `npm run build` or `yarn build`
     - Output directory: Usually `build` or `dist` (depends on your framework)
   - Click "Deploy"

4. **Set up environment variables (if needed)**
   - In your Vercel project dashboard, go to "Settings" > "Environment Variables"
   - Add any required environment variables for your application

5. **Configure custom domain (optional)**
   - In your project dashboard, go to "Settings" > "Domains"
   - Add your custom domain and follow the instructions to set up DNS

## Continuous Deployment

Vercel automatically redeploys your site when you push changes to your repository. No additional setup is needed for continuous deployment.

## Troubleshooting

If you encounter issues during deployment:

1. Check build logs in the Vercel dashboard
2. Ensure all dependencies are properly listed in your package.json
3. Verify that your build command works locally
4. Check that any required environment variables are set correctly

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Deploying React Applications](https://vercel.com/guides/deploying-react-with-vercel)

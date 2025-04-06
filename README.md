# R2Drive - File Manager for Cloudflare R2

R2Drive is a modern web application that allows you to easily and intuitively manage files in Cloudflare R2. With an interface inspired by MEGA, it offers functionalities such as:

- 📂 Complete bucket exploration with list or grid view
- 📤 Upload individual files or entire folders via drag & drop
- 🗂️ Organization in folders and subfolders
- 🗑️ Deletion of files and folders
- 🔄 Real-time content updates

![R2Drive Screenshot](https://ejemplo.com/screenshot.png)

## Requirements

- Node.js 18 or higher
- Cloudflare account with R2 access
- R2 bucket created in Cloudflare

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/falgom4/R2Drive.git
   cd R2Drive
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Cloudflare R2 credentials:
   ```
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id
   CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
   CLOUDFLARE_R2_BUCKET=your_bucket_name
   CLOUDFLARE_R2_PUBLIC_URL=your_bucket_public_url (optional)
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser

## Cloudflare R2 Credentials Configuration

To correctly configure R2Drive with your Cloudflare R2 account, follow these steps:

### 1. Obtain R2 Credentials

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account (falgom4)
3. In the sidebar menu, go to **R2**
4. If you don't have a bucket yet, create one with the **Create bucket** button
5. To get credentials, go to the **Manage R2 API Tokens** tab
6. Click on **Create new token** and select **R2 API Key Token**
7. Assign a name to the token (for example, "R2Drive Access")
8. Select the necessary permissions (recommended: read and write)
9. Click on **Create API token**
10. Save the **Access Key ID** and **Secret Access Key** shown (this will be the only time you can see the Secret Key)

### 2. Configure the .env.local file

Create a `.env.local` file in the project root with the following content:

```
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=your_bucket_public_url (optional)
```

Where:
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (visible in the dashboard URL)
- `CLOUDFLARE_ACCESS_KEY_ID`: The Access Key ID generated in the previous step
- `CLOUDFLARE_SECRET_ACCESS_KEY`: The Secret Access Key generated in the previous step
- `CLOUDFLARE_R2_BUCKET`: The name of the R2 bucket you want to manage
- `CLOUDFLARE_R2_PUBLIC_URL`: (Optional) If you've configured a custom domain for your bucket

## Using the Application

1. When starting the application, you'll see the main screen with a "drag & drop" area
2. Click on **Show bucket explorer** to see the current contents
3. You can navigate through folders by clicking on them
4. To upload files:
   - Drag files or folders to the designated area
   - Files will be uploaded to the currently selected folder
   - You'll see progress in real time
5. To delete files or folders:
   - Select items by clicking on the icon next to each one
   - Click on the **Delete** button that appears in the top bar
   - Confirm deletion in the dialog

## Advanced Features

- **List/Grid View**: Switch between different viewing modes with the buttons in the top right corner
- **Path Navigation**: The navigation bar shows the current path and allows you to quickly return to any level
- **Multiple Selection**: You can select multiple files and folders to delete them at once
- **Detailed Information**: In list view, information such as size and modification date is displayed

## Development

If you want to contribute to the project or customize it:

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production version
npm start

# Run linter
npm run lint
```

## Deployment

This application can be deployed on any platform that supports Next.js, such as Vercel, Netlify, or your own server.

```bash
npm run build
npm start
```

## Support

If you find any issues or have any questions, please create an issue in the GitHub repository.

## License

This project is licensed under the MIT license - see the LICENSE file for more details.

---

Developed by falgom4

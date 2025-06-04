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

3. Configure your Cloudflare R2 credentials:
   
   **Option 1: Via Web Interface (Recommended)**
   - Start the application with `npm run dev`
   - Open http://localhost:3000
   - The configuration modal will appear automatically
   - Enter your R2 credentials in the form
   
   **Option 2: Via .env.local file**
   ```
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=your_bucket_name
   R2_PUBLIC_URL=your_bucket_public_url (optional)
   ```

4. Open http://localhost:3000 in your browser and configure your credentials through the interface

## Cloudflare R2 Credentials Configuration

To correctly configure R2Drive with your Cloudflare R2 account, follow these steps:

### 1. Obtain R2 Credentials

1. Sign in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. In the sidebar menu, go to **R2**
4. If you don't have a bucket yet, create one with the **Create bucket** button
5. To get credentials, go to the **Manage R2 API Tokens** tab
6. Click on **Create new token** and select **R2 API Key Token**
7. Assign a name to the token (for example, "R2Drive Access")
8. Select the necessary permissions (recommended: read and write)
9. Click on **Create API token**
10. Save the **Access Key ID** and **Secret Access Key** shown (this will be the only time you can see the Secret Key)

### 2. Configure Credentials in R2Drive

**Method 1: Web Interface (Recommended)**
1. Start the application with `npm run dev`
2. Open http://localhost:3000 in your browser
3. The configuration modal will appear automatically if no credentials are detected
4. Or click the **Settings button (⚙️)** in the top right corner and select **"Configure credentials"**
5. Fill in the form with your R2 credentials:
   - **Account ID**: Your Cloudflare account ID (visible in the dashboard URL)
   - **Access Key ID**: The Access Key ID generated in the previous step
   - **Secret Access Key**: The Secret Access Key generated in the previous step
   - **Bucket Name**: The name of the R2 bucket you want to manage
   - **Public URL**: (Optional) If you've configured a custom domain for your bucket
6. Click **Save** - the connection will be verified automatically

**Method 2: .env.local file**
Create a `.env.local` file in the project root with the following content:

```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_bucket_public_url (optional)
```

**Note**: The environment variables use `R2_` prefix, not `CLOUDFLARE_` as shown in older versions.

## Using the Application

### Initial Setup
1. Configure your R2 credentials using the web interface (see configuration section above)
2. The connection status will be shown with a green "Connected to bucket" badge

### File Management
1. **View Files**: Click on **Show bucket explorer** to see the current contents
2. **Navigate**: Click on folders to enter them, use the breadcrumb navigation to go back
3. **Upload Files**:
   - Drag files or entire folders to the designated drop area
   - Or click **Browse files** to select files manually
   - Files will be uploaded to the currently selected folder
   - Real-time progress tracking is displayed
4. **Delete Files**:
   - Select items by clicking on the icon next to each one
   - Click on the **Delete** button that appears in the top bar
   - Confirm deletion in the dialog

### Settings
- **Theme Toggle**: Switch between light and dark modes
- **Refresh Connection**: Manually verify bucket connection
- **Reconfigure Credentials**: Update your R2 settings anytime

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


export default () => ({
    auth: {
        secret: process.env.APP_KEY
    },
    storage: {
        projectId: process.env.GCLOUD_PROJECT,
        keyFilename: process.env.GCS_KEYFILE,
        bucket: process.env.GCS_BUCKET
    }
});

import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      // Supabase Storage, used through its S3-compatible API. Local disk
      // storage would only exist on whichever single server wrote the
      // file — with the app running both on Render and locally, that
      // broke photos (they only lived on the machine that uploaded them).
      // A shared bucket like this is visible from everywhere.
      provider: 'aws-s3',
      providerOptions: {
        baseUrl: env('SUPABASE_STORAGE_PUBLIC_URL'),
        s3Options: {
          credentials: {
            accessKeyId: env('SUPABASE_S3_ACCESS_KEY_ID'),
            secretAccessKey: env('SUPABASE_S3_SECRET_ACCESS_KEY'),
          },
          endpoint: env('SUPABASE_S3_ENDPOINT'),
          region: env('SUPABASE_S3_REGION', 'ap-southeast-2'),
          forcePathStyle: true,
          params: {
            Bucket: env('SUPABASE_S3_BUCKET', 'product-images'),
          },
        },
      },
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
    },
  },
});

export default config;

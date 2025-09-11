# Environment Variables Documentation

This document provides comprehensive information about environment variables used in the Only Menu application.

## Overview

The application uses environment variables to manage configuration across different environments (development, staging, production). Environment detection is handled through the `NEXT_PUBLIC_ENV` variable, which determines which set of configuration variables to use.

## Environment Detection

The application supports three environments:

- **development**: Local development environment
- **staging**: Staging/pre-production environment
- **production**: Production environment

Environment is determined by the `NEXT_PUBLIC_ENV` variable. If not set, the application will throw an error during initialization.

## Environment Variables

### Core Environment Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_ENV` | string | Yes | Determines the current environment (`development`, `staging`, `production`) |
| `NODE_ENV` | string | Yes | Node.js environment (`development`, `production`) |

### Base URL Configuration

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_BASE_URL_PROD` | string | Yes* | Production base URL for client-side API calls |
| `NEXT_PUBLIC_BASE_URL_STAGING` | string | Yes* | Staging base URL for client-side API calls |

*Required when `NEXT_PUBLIC_ENV` is set to `production` or `staging`.

### Supabase Configuration

#### Development Environment
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | string | Yes* | Development Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | string | Yes* | Development Supabase anonymous key |

#### Production Environment
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL_PROD` | string | Yes* | Production Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD` | string | Yes* | Production Supabase anonymous key |

#### Staging Environment
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL_STAGING` | string | Yes* | Staging Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING` | string | Yes* | Staging Supabase anonymous key |

*Required based on the value of `NEXT_PUBLIC_ENV`.

### CAPTCHA Configuration

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | string | No | Cloudflare Turnstile site key for CAPTCHA |
| `TURNSTILE_SECRET_KEY` | string | No | Cloudflare Turnstile secret key for server-side validation |

### Redis Configuration (Upstash)

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | string | Yes | Upstash Redis REST API URL for caching operations |
| `UPSTASH_REDIS_REST_TOKEN` | string | Yes | Upstash Redis REST API token for authentication |

**Note**: Redis is used for caching user-specific data such as cafe listings to improve application performance.

### Legacy Variables (Deprecated)

| Variable | Type | Status | Description |
|----------|------|--------|-------------|
| `NEXT_PUBLIC_APP_URL` | string | Deprecated | Legacy app URL (use base URL variables instead) |

## Environment Variable Resolution

The application uses the following logic to determine which environment variables to use:

1. **Environment Detection**: Based on `NEXT_PUBLIC_ENV` value
2. **Supabase Configuration**: Automatically selects the appropriate Supabase credentials
3. **Base URL Selection**: Returns the correct base URL based on environment
4. **Validation**: Throws errors if required variables are missing

### Supabase Environment Resolution

```typescript
// Logic used in getSupabaseEnvironment()
if (isNextProduction) {
  return production_config;
} else if (isNextStaging) {
  return staging_config;
} else {
  return development_config; // default fallback
}
```

### Base URL Resolution

```typescript
// Logic used in getNextPublicBaseUrl()
if (isNextProduction) {
  return NEXT_PUBLIC_BASE_URL_PROD;
} else if (isNextStaging) {
  return NEXT_PUBLIC_BASE_URL_STAGING;
}
```

## Setup Instructions

### Development Environment

1. Copy the example file:
   ```bash
   cp env.example .env.local
   ```

2. Configure development variables:
   ```bash
   NEXT_PUBLIC_ENV=development
   NEXT_PUBLIC_SUPABASE_URL=your_development_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_development_supabase_anon_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
   ```

### Staging Environment

1. Set staging-specific variables:
   ```bash
   NEXT_PUBLIC_ENV=staging
   NEXT_PUBLIC_BASE_URL_STAGING=https://staging.yourdomain.com
   NEXT_PUBLIC_SUPABASE_URL_STAGING=your_staging_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING=your_staging_supabase_anon_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
   ```

### Production Environment

1. Set production-specific variables:
   ```bash
   NEXT_PUBLIC_ENV=production
   NEXT_PUBLIC_BASE_URL_PROD=https://yourdomain.com
   NEXT_PUBLIC_SUPABASE_URL_PROD=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD=your_production_supabase_anon_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
   ```

## Error Handling

The application includes comprehensive error handling for missing environment variables:

### Critical Errors
- `NEXT_PUBLIC_ENV` not set: Application startup fails
- Missing Supabase credentials for current environment: Application startup fails
- Missing Redis credentials: Application startup fails (Redis is required for caching)
- Missing base URL for production/staging: Application startup fails

### Error Messages
The application provides detailed error messages that include:
- Which environment is being used
- Which specific variables are missing
- Clear instructions to check environment configuration

## Security Considerations

### Public vs Private Variables

- **Public Variables** (prefixed with `NEXT_PUBLIC_`): Exposed to the browser
  - Base URLs
  - Supabase URLs and anonymous keys
  - Environment type
  - Turnstile site key

- **Private Variables**: Server-side only
  - Turnstile secret key
  - Sensitive configuration

### Best Practices

1. **Never commit secrets** to version control
2. **Use different credentials** for each environment
3. **Validate variables** at application startup
4. **Document all variables** clearly
5. **Use environment-specific naming** conventions

## Usage in Code

### Importing Environment Configuration

```typescript
import {
  isDevelopment,
  isProduction,
  isNextStaging,
  nextPublicBaseUrl,
  supabaseConfig
} from '@/lib/env';
```

### Using Environment Checks

```typescript
// Check current environment
if (isDevelopment) {
  console.log('Running in development mode');
}

// Get current base URL
const baseUrl = nextPublicBaseUrl;

// Get Supabase configuration
const { supabaseUrl, supabaseAnonKey, environment } = supabaseConfig;
```

## Troubleshooting

### Common Issues

1. **Application won't start**: Check that `NEXT_PUBLIC_ENV` is set
2. **Supabase connection fails**: Verify Supabase credentials for current environment
3. **Redis connection fails**: Verify Upstash Redis URL and token are correctly configured
4. **Caching not working**: Check Redis credentials and network connectivity
5. **Wrong base URL**: Ensure base URL variables match the environment
6. **CAPTCHA not working**: Check Turnstile keys are properly configured

### Validation

Run the following command to validate your environment setup:

```bash
# The application will throw errors on startup if variables are missing
npm run dev
```

## Migration Notes

- `NEXT_PUBLIC_APP_URL` is deprecated in favor of environment-specific base URLs
- All Supabase variables now support environment-specific configuration
- CAPTCHA support added with Cloudflare Turnstile integration
- Redis caching support added with Upstash for improved performance

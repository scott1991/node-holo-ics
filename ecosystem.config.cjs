const name = "holoics"
module.exports = {
  apps: [
    {
      name: name,
      script: "index.js",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      out_file: `../logs/${name}-out.log`,
      error_file: `../logs/${name}-err.log`,
      logrotate: {
        max_size: "3M",
        retain: 5,
        compress: false,
        dateFormat: "MMDDHHmmss"
      },
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
/**
 * The 'log_file' is not used because it would duplicate the content with 'out_file' and 'error_file', and 
 * by default it's disabled. 
 * 
 * If we disable 'out_file' and 'error_file', and enable 'log_file', it might seem good, but it will 
 * display nothing when you use 'pm2 logs'. This would only display newly generated logs.
 *  
 * This file is named as '.cjs' because the project is using `"type":"module"`. You need to use
 * `pm2 start ecosystem.config.cjs` since PM2 only looks for `ecosystem.config.js` by default.
 */
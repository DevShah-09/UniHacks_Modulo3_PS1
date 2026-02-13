const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

// 1. Check for hidden characters
console.log('--- 1. URI Inspection ---');
if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}
console.log(`URI Length: ${uri.length}`);
// Print char codes to check for invisible characters
const charCodes = [];
for (let i = 0; i < uri.length; i++) {
    const code = uri.charCodeAt(i);
    if (code < 32 || code > 126) {
        console.log(`⚠️  WARNING: Invisible/Special character found at index ${i}: code ${code}`);
    }
}
console.log('URI Content (masked): ' + uri.replace(/:([^:@]+)@/, ':****@')); // Hide password

// 2. DNS Sanity Check
console.log('\n--- 2. DNS Sanity Check (google.com) ---');
dns.lookup('google.com', (err, address) => {
    if (err) {
        console.error('❌ DNS Sanity Check Failed: Could not resolve google.com');
        console.error('   This indicates a general internet or DNS issue on your machine.');
        console.error('   Error:', err.message);
    } else {
        console.log('✅ DNS Sanity Check Passed: google.com ->', address);
        checkMongoDNS();
    }
});

function checkMongoDNS() {
    console.log('\n--- 3. MongoDB DNS Check ---');
    const match = uri.match(/@([^/?]+)/);
    const hostname = match ? match[1] : null;

    if (!hostname) {
        console.error('❌ Could not extract hostname from URI');
        return;
    }

    console.log(`Checking hostname: ${hostname}`);

    // Try A Record first (Basic existence)
    dns.lookup(hostname, (err, address) => {
        if (err) {
            console.error(`❌ A Record Lookup Failed for ${hostname}`);
            console.error('   Error:', err.message);
            console.log('   -> This strongly suggests the HOSTNAME IS INCORRECT.');
            console.log('   -> Please double check the "unihacks.nhslt0h.mongodb.net" part.');
        } else {
            console.log(`✅ A Record Found: ${address}`);
        }
    });

    // Try SRV Record (Required for mongodb+srv)
    const srvHostname = `_mongodb._tcp.${hostname}`;
    console.log(`Checking SRV record: ${srvHostname}`);
    dns.resolveSrv(srvHostname, (err, addresses) => {
        if (err) {
            console.error(`❌ SRV Record Lookup Failed for ${srvHostname}`);
            console.error('   Error:', err.code);
            if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
                console.log('   -> The domain exists but is not a valid MongoDB SRV cluster, OR the domain does not exist.');
            }
        } else {
            console.log('✅ SRV Record Found:', addresses);
            // If we get here, try to connect
            tryConnect();
        }
    });
}

function tryConnect() {
    console.log('\n--- 4. Mongoose Connection Attempt ---');
    mongoose.connect(uri)
        .then(() => {
            console.log('✅ MongoDB Connected Successfully!');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Mongoose Connection Failed:', err.message);
            process.exit(1);
        });
}

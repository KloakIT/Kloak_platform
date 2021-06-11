(() => {
    const C = Crypto;
    const _blocksize = 16;
    const base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const UTF8 = {
        // Convert a string to a byte array
        stringToBytes: (str) => {
            return Binary.stringToBytes(unescape(encodeURIComponent(str)));
        },
        // Convert a byte array to a string
        bytesToString: (bytes) => {
            return decodeURIComponent(escape(Binary.bytesToString(bytes)));
        }
    };
    const util = {
        // Bit-wise rotate left
        rotl: (n, b) => {
            return (n << b) | (n >>> (32 - b));
        },
        // Bit-wise rotate right
        rotr: (n, b) => {
            return (n << (32 - b)) | (n >>> b);
        },
        // Swap big-endian to little-endian and vice versa
        endian: (n) => {
            // If number given, swap endian
            if (n.constructor == Number) {
                return util.rotl(n, 8) & 0x00FF00FF |
                    util.rotl(n, 24) & 0xFF00FF00;
            }
            // Else, assume array and swap all items
            for (var i = 0; i < n; i++) {
                n[i] = util.endian(n[i]);
            }
            return n;
        },
        // Generate an array of any length of random bytes
        randomBytes: (n) => {
            const array = new Uint8Array(n);
            crypto.getRandomValues(array);
            // Now convert them from a Uint8Array to a regular array of ints.
            return [].map.call(array, (_) => { return _; });
        },
        // Convert a byte array to big-endian 32-bit words
        bytesToWords: (bytes) => {
            let words = [];
            for (let i = 0, b = 0; i < bytes.length; i++, b += 8) {
                words[b >>> 5] |= bytes[i] << (24 - b % 32);
            }
            return words;
        },
        // Convert big-endian 32-bit words to a byte array
        wordsToBytes: (words) => {
            let bytes = [];
            for (let b = 0; b < words.length * 32; b += 8) {
                bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
            }
            return bytes;
        },
        // Convert a byte array to a hex string
        bytesToHex: (bytes) => {
            let hex = [];
            for (let i = 0; i < bytes.length; i++) {
                hex.push((bytes[i] >>> 4).toString(16));
                hex.push((bytes[i] & 0xF).toString(16));
            }
            return hex.join("");
        },
        // Convert a hex string to a byte array
        hexToBytes: (hex) => {
            let bytes = [];
            for (let c = 0; c < hex.length; c += 2) {
                bytes.push(parseInt(hex.substr(c, 2), 16));
            }
            return bytes;
        },
        // Convert a byte array to a base-64 string
        bytesToBase64: (bytes) => {
            // Use browser-native function if it exists
            if (typeof btoa === "function") {
                return btoa(Binary.bytesToString(bytes));
            }
            let base64 = [];
            for (let i = 0; i < bytes.length; i += 3) {
                var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
                for (let j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 <= bytes.length * 8) {
                        base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
                    }
                    else
                        base64.push("=");
                }
            }
            return base64.join("");
        },
        // Convert a base-64 string to a byte array
        base64ToBytes: (base64) => {
            // Use browser-native function if it exists
            if (typeof atob === "function") {
                return Binary.stringToBytes(atob(base64));
            }
            // Remove non-base-64 characters
            base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");
            let bytes = [];
            for (let i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4) {
                if (imod4 == 0) {
                    continue;
                }
                bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
                    (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
            }
            return bytes;
        }
    };
    const HMAC = (hasher, message, key, options) => {
        // Convert to byte arrays
        message = typeof message === 'string' ? UTF8.stringToBytes(message) : message;
        key = typeof key === 'string' ? UTF8.stringToBytes(key) : key;
        /* else, assume byte arrays already */
        // Allow arbitrary length keys
        if (key.length > _blocksize * 4) {
            key = hasher(key, { asBytes: true });
        }
        // XOR keys with pad constants
        let okey = key.slice(0), ikey = key.slice(0);
        for (let i = 0; i < _blocksize * 4; i++) {
            okey[i] ^= 0x5C;
            ikey[i] ^= 0x36;
        }
        var hmacbytes = hasher(okey.concat(hasher(ikey.concat(message), { asBytes: true })), { asBytes: true });
        return options?.asBytes ? hmacbytes :
            options?.asString ? Binary.bytesToString(hmacbytes) :
                util.bytesToHex(hmacbytes);
    };
    const SHA1 = (message, options) => {
        const digestbytes = util.wordsToBytes(_sha1(message));
        return options && options.asBytes ? digestbytes :
            options && options.asString ? Binary.bytesToString(digestbytes) :
                util.bytesToHex(digestbytes);
    };
    const _sha1 = (message) => {
        // Convert to byte array
        message = typeof message === 'string' ? UTF8.stringToBytes(message) : message;
        /* else, assume byte array already */
        let m = util.bytesToWords(message), l = message.length * 8, w = [], H0 = 1732584193, H1 = -271733879, H2 = -1732584194, H3 = 271733878, H4 = -1009589776;
        // Padding
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >>> 9) << 4) + 15] = l;
        for (let i = 0; i < m.length; i += 16) {
            let a = H0, b = H1, c = H2, d = H3, e = H4;
            for (let j = 0; j < 80; j++) {
                if (j < 16) {
                    w[j] = m[i + j];
                }
                else {
                    let n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
                    w[j] = (n << 1) | (n >>> 31);
                }
                var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                    j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                        j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                            (H1 ^ H2 ^ H3) - 899497514);
                H4 = H3;
                H3 = H2;
                H2 = (H1 << 30) | (H1 >>> 2);
                H1 = H0;
                H0 = t;
            }
            H0 += a;
            H1 += b;
            H2 += c;
            H3 += d;
            H4 += e;
        }
        return [H0, H1, H2, H3, H4];
    };
    const K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
        0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
        0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
        0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
        0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
        0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
        0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
        0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
        0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
        0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
        0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
        0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
        0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
        0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
        0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
        0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
    const _sha256 = (message) => {
        // Convert to byte array
        message = typeof message === 'string' ? UTF8.stringToBytes(message) : message;
        /* else, assume byte array already */
        let m = util.bytesToWords(message), l = message.length * 8, H = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
            0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19], w = [], a, b, c, d, e, f, g, h, i, j, t1, t2;
        // Padding
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for (let i = 0; i < m.length; i += 16) {
            a = H[0];
            b = H[1];
            c = H[2];
            d = H[3];
            e = H[4];
            f = H[5];
            g = H[6];
            h = H[7];
            for (let j = 0; j < 64; j++) {
                if (j < 16) {
                    w[j] = m[j + i];
                }
                else {
                    let gamma0x = w[j - 15], gamma1x = w[j - 2], gamma0 = ((gamma0x << 25) | (gamma0x >>> 7)) ^
                        ((gamma0x << 14) | (gamma0x >>> 18)) ^
                        (gamma0x >>> 3), gamma1 = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                        ((gamma1x << 13) | (gamma1x >>> 19)) ^
                        (gamma1x >>> 10);
                    w[j] = gamma0 + (w[j - 7] >>> 0) +
                        gamma1 + (w[j - 16] >>> 0);
                }
                var ch = e & f ^ ~e & g, maj = a & b ^ a & c ^ b & c, sigma0 = ((a << 30) | (a >>> 2)) ^
                    ((a << 19) | (a >>> 13)) ^
                    ((a << 10) | (a >>> 22)), sigma1 = ((e << 26) | (e >>> 6)) ^
                    ((e << 21) | (e >>> 11)) ^
                    ((e << 7) | (e >>> 25));
                t1 = (h >>> 0) + sigma1 + ch + (K[j]) + (w[j] >>> 0);
                t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
                e = d + t1;
                d = c;
                c = b;
                b = a;
                a = t1 + t2;
            }
            H[0] += a;
            H[1] += b;
            H[2] += c;
            H[3] += d;
            H[4] += e;
            H[5] += f;
            H[6] += g;
            H[7] += h;
        }
        return H;
    };
    const SHA256 = (message, options) => {
        var digestbytes = util.wordsToBytes(_sha256(message));
        return options && options.asBytes ? digestbytes :
            options && options.asString ? Binary.bytesToString(digestbytes) :
                util.bytesToHex(digestbytes);
    };
    var Binary = {
        // Convert a string to a byte array
        stringToBytes: (str) => {
            for (var bytes = [], i = 0; i < str.length; i++)
                bytes.push(str.charCodeAt(i) & 0xFF);
            return bytes;
        },
        // Convert a byte array to a string
        bytesToString: (bytes) => {
            for (var str = [], i = 0; i < bytes.length; i++)
                str.push(String.fromCharCode(bytes[i]));
            return str.join("");
        }
    };
    Crypto.PBKDF2 = (password, salt, keylen, options) => {
        password = typeof password === 'string' ? UTF8.stringToBytes(password) : password;
        salt = typeof salt === 'string' ? UTF8.stringToBytes(salt) : salt;
        const hasher = options?.hasher || SHA256;
        const iterations = options?.iterations || 1;
        const PRF = (password, salt) => {
            return HMAC(hasher, salt, password, { asBytes: true });
        };
        // Generate key
        let derivedKeyBytes = [];
        let blockindex = 1;
        while (derivedKeyBytes.length < keylen) {
            let block = PRF(password, salt.concat(util.wordsToBytes([blockindex])));
            for (let u = block, i = 1; i < iterations; i++) {
                u = PRF(password, u);
                for (let j = 0; j < block.length; j++) {
                    block[j] ^= u[j];
                }
            }
            derivedKeyBytes = derivedKeyBytes.concat(block);
            blockindex++;
            // Truncate excess bytes
            derivedKeyBytes.length = keylen;
            return options?.asBytes ? derivedKeyBytes :
                options.asString ? Binary.bytesToString(derivedKeyBytes) :
                    util.bytesToHex(derivedKeyBytes);
        }
    };
})();

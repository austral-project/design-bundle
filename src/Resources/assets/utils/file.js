/*
 * This file is part of the Austral Design Bundle package.
 *
 * (c) Austral <support@austral.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export const fileSizeHumanize = (bytes, si = false) => {
  const thresh = si ? 1000 : 1024;
  if (bytes < thresh) return bytes + ' B';
  const units = si
    ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
    : ['Ko','Mo','Go','To','Po','Eo','Zo','Yo'];
  let u = -1;
  do { bytes /= thresh; ++u; } while (bytes >= thresh);
  return bytes.toFixed(1) + ' ' + units[u];
};

export const fileExists = (url) => {
  if (!url) return false;
  const req = new XMLHttpRequest();
  req.open('GET', url, false);
  req.send();
  return req.status === 200;
};

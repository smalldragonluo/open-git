/**
 * @author 龙喜<xiaolong.lxl@alibaba-inc.com>
 * @description utils
 */

'use strict';

const cp = require('child_process');
const os = require('os');

function exec(cmd, option) {
  return new Promise((resolve, reject)=> {
    cp.exec(cmd, option || {}, (err, stdout, stderr)=> {
      if (err) {
        reject(err, stdout, stderr);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
}

/**
 * spawn a child process(support win32)
 * @param cmd
 * @param args
 * @param option
 * @param onData when new data flushed
 * @returns {Promise}
 */
function spawn(cmd, args, option, onData) {
  return new Promise((resolve, reject)=> {
    let spawnProcess;
    const buffer = [];

    if (os.platform() === 'win32') {
      args.unshift(cmd);
      spawnProcess = cp.spawn('cmd', ['/s', '/c'].concat(args), option);
    } else {
      spawnProcess = cp.spawn(cmd, args, option);
    }

    spawnProcess.stdout.on('data', processData);
    spawnProcess.stderr.on('data', processData);
    spawnProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(Buffer.concat(buffer).toString('utf-8')));
      } else {
        resolve(Buffer.concat(buffer).toString('utf-8'));
      }
    });
    spawnProcess.on('error', (error) => {
      reject(error);
    });

    function processData(data) {
      buffer.push(data);

      data = data.toString('utf-8');

      process.stdout.write(data);
      onData && onData(data, spawnProcess, resolve, reject);
    }
  });
}

/**
 * shell 同步执行
 * @param modulePath
 * @param cmd
 * @returns {*}
 */
function execs(modulePath, cmd) {
  return exec(cmd, {cwd: modulePath});
}

/**
 * 异步执行输出
 * @param modulePath
 * @param cmd
 * @param args
 * @param option
 * @param onData when new data flushed
 * @param force ensure any confirm, stdin must be pipe
 * @returns {*}
 */
function spawns(modulePath, cmd, args, option, onData, force) {
  return spawn(
    cmd,
    args,
    Object.assign({
      cwd: modulePath,
      stdio: [process.stdin, 'pipe', 'pipe']
    }, option),
    force ? (data, childProcess, resolve, reject) => {
      if (data.indexOf('(Y/n)') !== -1) {
        if (childProcess) {
          console.log('已自动确认 confirm 操作');
          // ANSI escape (enter)
          childProcess.stdin.write('\x0D');
          // 貌似这个也管用... 双保险，shell 只会确认一次换行
          childProcess.stdin.write('\n');
        } else {
          console.log('stdin 非 pipe 模式，无法自动安装');
        }
      }

      onData && onData.apply(this, arguments);
    } : onData
  );
}

module.exports = {
  exec,
  execs,
  spawn,
  spawns
};

/**
 * 应用内日志器：
 *  - 镜像 console 输出到日志抽屉（可在UI中直接审查，便于截图取证）
 *  - 捕获 window.onerror / unhandledrejection
 *  - 记录条数统计（info/warn/error），供状态栏与测试断言使用
 */
const MAX_LINES = 500;

class Logger {
  constructor() {
    this.lines = [];
    this.count = { info: 0, warn: 0, error: 0 };
    this.viewEl = null;
    this.onChange = null;
    this._installHooks();
  }

  bindView(el) { this.viewEl = el; this.flush(); }

  _push(level, args) {
    // 过滤 console 的 %c/%s 格式化参数（样式串不进入日志）
    const clean = [];
    let skipNext = false;
    for (const a of args) {
      if (skipNext) { skipNext = false; continue; }
      if (typeof a === 'string' && /%[csd]/.test(a)) {
        // 仍有格式符：保留去掉 %c 后的文本，并跳过其样式实参
        let s = a.replace(/%c/g, '').replace(/%\d*\$?[sdifo]/g, '');
        clean.push(s);
        if (a.includes('%c')) skipNext = true;
        continue;
      }
      clean.push(a);
    }
    const msg = clean.map(a => {
      if (a instanceof Error) return `${a.message}\n${a.stack || ''}`;
      if (typeof a === 'object') { try { return JSON.stringify(a, null, 0)?.slice(0, 400); } catch { return String(a); } }
      return String(a);
    }).join(' ');
    const t = new Date().toISOString().slice(11, 23);
    const line = { t, level, msg };
    this.lines.push(line);
    if (this.lines.length > MAX_LINES) this.lines.shift();
    this.count[level === 'ok' ? 'info' : level]++;
    if (this.viewEl) this._append(line);
    this.onChange?.(this.count, line);
  }

  _append(line) {
    const div = document.createElement('div');
    div.className = `log-line ${line.level}`;
    const t = document.createElement('span'); t.className = 't'; t.textContent = line.t;
    div.appendChild(t);
    div.appendChild(document.createTextNode(line.msg));
    this.viewEl.appendChild(div);
    while (this.viewEl.childElementCount > MAX_LINES) this.viewEl.firstElementChild.remove();
    this.viewEl.scrollTop = this.viewEl.scrollHeight;
  }

  flush() {
    if (!this.viewEl) return;
    this.viewEl.innerHTML = '';
    this.lines.forEach(l => this._append(l));
  }

  info(...a)  { console.log(...a);  this._push('info', a); }
  ok(...a)    { console.log(...a);  this._push('ok', a); }
  warn(...a)  { console.warn(...a); this._push('warn', a); }
  error(...a) { console.error(...a); this._push('error', a); }

  /** 将 console.* 重定向进日志抽屉（保留原始调用） */
  _installHooks() {
    const orig = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
    };
    console.log = (...a) => { orig.log(...a); this._push('info', a); };
    console.warn = (...a) => { orig.warn(...a); this._push('warn', a); };
    console.error = (...a) => { orig.error(...a); this._push('error', a); };
    window.addEventListener('error', (e) => {
      this._push('error', [`未捕获异常: ${e.message} @ ${e.filename?.split('/').pop()}:${e.lineno}`]);
    });
    window.addEventListener('unhandledrejection', (e) => {
      this._push('error', [`未处理的 Promise 拒绝: ${e.reason}`]);
    });
  }

  summary() { return { ...this.count, total: this.lines.length }; }
  text() { return this.lines.map(l => `[${l.t}] ${l.level.toUpperCase()} ${l.msg}`).join('\n'); }
}

export const logger = new Logger();

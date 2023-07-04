import sys
import subprocess
from smtplib import SMTP_SSL
import toml
import pathlib
import datetime 


def send_alert(cfg, errors):
    server = SMTP_SSL(cfg['email_server'], 465)
    server.login(cfg['email_account'], cfg['email_password'])
    from_account = 'verify@keysafe.network'
    to_accounts = ['jiangyanxoxo@qq.com']
    msg = format_msg(from_account, to_accounts, errors)
    print(msg)
    server.sendmail(
        from_account,
        to_accounts,
        bytes(msg, 'utf-8')
    )
    server.quit()

def format_msg(from_acc, to_accs, errs):
    return (
        "Subject: keysafe error alert\r\n"
        f"From: <{from_acc}>\r\n"
        f"To: <{','.join(to_accs)}>\r\n\r\n"
        f"{';'.join(errs)}"
    )

def append_path(log_path):
    working_dir = pathlib.Path(__file__).parent.resolve().parent.resolve()
    print(working_dir)
    return working_dir.joinpath(log_path)

def in_time_range(line):
    parts = line.split()
    if len(parts) > 6:
        log_time = line.split('|')[0].strip()
        try: 
            c = datetime.datetime.now()
            a = datetime.datetime(c.year, c.month, c.day, c.hour, c.minute, 0)
            b = a - datetime.timedelta(minutes=5)
            log_time = datetime.datetime.fromisoformat(log_time)
            return log_time < a and log_time > b
        except Exception as err:
            print(err)
            return false
    print(parts)
    return false

def check_log_file_for_err(log_path):
    # looking for erros in the last n minutes
    log_path = append_path(log_path)
    print(log_path)
    errs = []
    with open(log_path, 'r') as f:
        for l in f.readlines():
            print('checking line:', l)
            if in_time_range(l):
                errs.append(l)
    return errs

def check_std_file_for_err(log_path):
    log_path = append_path(log_path)
    print(log_path)
    errs = []
    return errs

def monitor_app(conf):
    port = conf['node_api_port']
    result = subprocess.run(
        f"netstat -antp|grep {port}", 
        shell=True, 
        capture_output=True)
    content = result.stdout.decode('utf-8')
    for l in content.split('\n'):
        if 'LISTEN' in l and f'0.0.0.0:{port}' == l.split()[3]:
            return []
    return ['Port is not listening, process is down.']

def monitor_log_files(conf):
    err1 = check_log_file_for_err('bin/logs/err.log')
    # err2 = check_std_file_for_err('bin/tee.log')
    err3 = monitor_app(conf)
    errs = err1 + err3
    if errs:
        # print(errs)        
        send_alert(conf, errs)

def load_cfg(cfg_file):
    with open(cfg_file, 'r') as f:
        return toml.load(f)

if __name__ == '__main__':
    cfg = load_cfg(sys.argv[1])
    monitor_log_files(cfg)

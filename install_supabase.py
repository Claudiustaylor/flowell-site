import subprocess
r = subprocess.run(['npm','install','@supabase/supabase-js'], cwd='/Users/ct/projects/flowell-next', capture_output=True, text=True, timeout=60)
print(r.stdout[-300:])
print(r.stderr[-300:])
print('EXIT:', r.returncode)

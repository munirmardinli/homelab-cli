# Usage

## Windows SSH Enable

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

Start-Service sshd

Set-Service -Name sshd -StartupType 'Automatic'

New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22

Get-Service sshd

Get-NetFirewallRule -Name *ssh* | Select-Object Name, Enabled, Direction, Action, Profile
```

# 🛡️ DNS-Blockliste für Pi-hole

**The Big Blocklist Collection**

Diese Sammlung von Host-Listen hilft dir, Werbung, Tracker, Malware und andere unerwünschte Inhalte mit Pi-hole oder ähnlicher DNS-basierten Software zu blockieren.

---

## 🔗 Inhaltsverzeichnis

- [⚠️ Verdächtige & Malware-Quellen](#️-verdächtige--malware-quellen)
- [📢 Werbeblocker-Listen](#-werbeblocker-listen)
- [📡 Tracking & Telemetrie](#-tracking--telemetrie)
- [🛑 Schädliche Domains](#-schädliche-domains)
- [🧩 Weitere Listen](#-weitere-listen)
- [🎯 Youtube Ad Regex](#-youtube-ad-regex)

---

## ⚠️ Verdächtige & Malware-Quellen

```txt
https://raw.githubusercontent.com/PolishFiltersTeam/KADhosts/master/KADhosts.txt
https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Spam/hosts
https://v.firebog.net/hosts/static/w3kbl.txt
https://raw.githubusercontent.com/matomo-org/referrer-spam-blacklist/master/spammers.txt
https://someonewhocares.org/hosts/zero/hosts
https://raw.githubusercontent.com/VeleSila/yhosts/master/hosts
https://winhelp2002.mvps.org/hosts.txt
https://v.firebog.net/hosts/neohostsbasic.txt
https://raw.githubusercontent.com/RooneyMcNibNug/pihole-stuff/master/SNAFU.txt
https://paulgb.github.io/BarbBlock/blacklists/hosts-file.txt
https://hostsfile.mine.nu/hosts0.txt
https://hostsfile.org/Downloads/hosts.txt
https://www.joewein.net/dl/bl/dom-bl-base.txt
https://v.firebog.net/hosts/Kowabit.txt
https://adblock.mahakala.is
```

### 📢 Werbeblocker-Listen

```text
https://adaway.org/hosts.txt
https://v.firebog.net/hosts/AdguardDNS.txt
https://v.firebog.net/hosts/Admiral.txt
https://raw.githubusercontent.com/anudeepND/blacklist/master/adservers.txt
https://v.firebog.net/hosts/Easylist.txt
https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext
https://raw.githubusercontent.com/FadeMind/hosts.extras/master/UncheckyAds/hosts
https://raw.githubusercontent.com/bigdargon/hostsVN/master/hosts
https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt
https://raw.githubusercontent.com/jdlingyu/ad-wars/master/hosts
```

### 📡 Tracking & Telemetrie

```text
https://v.firebog.net/hosts/Easyprivacy.txt
https://v.firebog.net/hosts/Prigent-Ads.txt
https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.2o7Net/hosts
https://raw.githubusercontent.com/crazy-max/WindowsSpyBlocker/master/data/hosts/spy.txt
https://hostfiles.frogeye.fr/firstparty-trackers-hosts.txt
https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/android-tracking.txt
https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt
https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/AmazonFireTV.txt
https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-blocklist.txt
https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt
https://hostfiles.frogeye.fr/multiparty-trackers-hosts.txt
https://raw.githubusercontent.com/Kees1958/W3C_annual_most_used_survey_blocklist/6b8c2411f22dda68b0b41757aeda10e50717a802/TOP_EU_US_Ads_Trackers_HOST
```

### 🛑 Schädliche Domains

```text
https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareHosts.txt
https://v.firebog.net/hosts/Prigent-Crypto.txt
https://raw.githubusercontent.com/FadeMind/hosts.extras/master/add.Risk/hosts
https://bitbucket.org/ethanr/dns-blacklists/raw/8575c9f96e5b4a1308f2f12394abd86d0927a4a0/bad_lists/Mandiant_APT1_Report_Appendix_D.txt
https://phishing.army/download/phishing_army_blocklist_extended.txt
https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-malware.txt
https://v.firebog.net/hosts/RPiList-Malware.txt
https://raw.githubusercontent.com/Spam404/lists/master/main-blacklist.txt
https://raw.githubusercontent.com/AssoEchap/stalkerware-indicators/master/generated/hosts
https://urlhaus.abuse.ch/downloads/hostfile/
https://lists.cyberhost.uk/malware.txt
https://malware-filter.gitlab.io/malware-filter/phishing-filter-hosts.txt
https://v.firebog.net/hosts/Prigent-Malware.txt
https://raw.githubusercontent.com/jarelllama/Scam-Blocklist/main/lists/wildcard_domains/scams.txt
https://v.firebog.net/hosts/RPiList-Phishing.txt
https://osint.digitalside.it/Threat-Intel/lists/latestdomains.txt
https://s3.amazonaws.com/lists.disconnect.me/simple_malvertising.txt
https://raw.githubusercontent.com/tg12/pihole-phishtank-list/master/list/phish_domains.txt
https://raw.githubusercontent.com/HorusTeknoloji/TR-PhishingList/master/url-lists.txt
```

### 🧩 Weitere Listen

```text
https://raw.githubusercontent.com/chadmayfield/my-pihole-blocklists/master/lists/pi_blocklist_porn_top1m.list
https://v.firebog.net/hosts/Prigent-Adult.txt
https://raw.githubusercontent.com/anudeepND/blacklist/master/facebook.txt
```

### 🎯 Youtube Ad Regex

```text
^ad([sxv]?[0-9]*|system)[_.-]([^.[:space:]]+\.){1,}|[_.-]ad([sxv]?[0-9]*|system)[_.-]
^(.+[_.-])?adse?rv(er?|ice)?s?[0-9]*[_.-]
^(.+[_.-])?telemetry[_.-]
^adim(age|g)s?[0-9]*[_.-]
^adtrack(er|ing)?[0-9]*[_.-]
^advert(s|is(ing|ements?))?[0-9]*[_.-]
^aff(iliat(es?|ion))?[_.-]
^analytics?[_.-]
^banners?[_.-]
^beacons?[0-9]*[_.-]
^count(ers?)?[0-9]*[_.-]
^mads\.
^pixels?[-.]
^stat(s|istics)?[0-9]*[_.-]
^https?://([A-Za-z0-9.-]*\.)?clicks\.beap\.bc\.yahoo\.com/
^https?://([A-Za-z0-9.-]*\.)?secure\.footprint\.net/
^https?://([A-Za-z0-9.-]*\.)?match\.com/
^https?://([A-Za-z0-9.-]*\.)?clicks\.beap\.bc\.yahoo(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?sitescout(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?appnexus(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?evidon(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?mediamath(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?scorecardresearch(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?doubleclick(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?flashtalking(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?turn(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?mathtag(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?googlesyndication(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?s\.yimg\.com/cv/ae/us/audience/
^https?://([A-Za-z0-9.-]*\.)?clicks\.beap/
^https?://([A-Za-z0-9.-]*\.)?.doubleclick(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?yieldmanager(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?w55c(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?adnxs(\.\w{2}\.\w{2}|\.\w{2,4})/
^https?://([A-Za-z0-9.-]*\.)?advertising\.com/
^https?://([A-Za-z0-9.-]*\.)?evidon\.com/
^https?://([A-Za-z0-9.-]*\.)?scorecardresearch\.com/
^https?://([A-Za-z0-9.-]*\.)?flashtalking\.com/
^https?://([A-Za-z0-9.-]*\.)?turn\.com/
^https?://([A-Za-z0-9.-]*\.)?mathtag\.com/
^https?://([A-Za-z0-9.-]*\.)?surveylink/
^https?://([A-Za-z0-9.-]*\.)?info\.yahoo\.com/
^https?://([A-Za-z0-9.-]*\.)?ads\.yahoo\.com/
^https?://([A-Za-z0-9.-]*\.)?global\.ard\.yahoo\.com/
(\.|^)googleadservices\.net$
(\.|^)googleads\.g\.doubleclick\.net$
(\.|^)googleadservices\.com$
```

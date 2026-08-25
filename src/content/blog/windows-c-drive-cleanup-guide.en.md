---
title: 'A complete guide to cleaning a Windows C: drive'
description: 'A full C: drive is the headache every Windows user hits. This guide goes from simple to advanced — safe ways to reclaim space without reinstalling Windows.'
pubDate: '2020-09-14'
heroImage: '../../assets/cover-windows-c-drive-cleanup-guide-en.jpg'
tags: ['Windows', '教程']
lang: en
translationKey: 'windows-c-drive-cleanup-guide'
---

A full C: drive is probably the most common Windows headache. The longer you use the machine, the less free space you have — especially after Windows 10, when the OS itself got hungrier.

This is a complete cleanup path from simple to advanced. The steps are straightforward and the side effects are small.

> **Safety:** a few of these operations carry some risk to the system or to personal files. Each section is marked with difficulty and safety. Stay inside your own level.

![A Win10 desktop running out of C: space](../../assets/inline-windows-c-drive-cleanup-guide-01.jpg)

---

## 1. Fastest and simplest — software cleanup

**Difficulty: easy | Safety: high**

Cleaning caches with software is the most ordinary, convenient move. There are plenty of free tools — Huorong's built-in junk cleaner, for example.

### Windows 10's own cleanup

If you do not want a third-party cleaner, Windows 10 can do it:

1. Click Start (bottom left) → the gear to open Settings
2. Open **Storage**
3. Turn on **Storage Sense**

When space is tight, the system will periodically clean caches. You can also run a cleanup immediately from the same screen.

> These clicks match Windows 10 version 1909. Earlier builds look slightly different. Upgrade if you can.

---

## 2. Move apps and personal files off C:

Software cleanup is modest. The space you get back is limited. To go further you have to move things by hand.

### 1. Move personal folders

**Difficulty: easy | Safety: high**

In Storage settings, move every personal directory to D: (or another data volume) and apply.

"Documents," "Pictures," and the rest on C: now live on D:.

#### Manual move (not Windows 10 1909)

In This PC, right-click Desktop → Properties → **Location** → Move. You can park the Desktop folder on another partition.

> **Important:** create the destination folder on the other partition *before* you move.

Do the same for Documents, Downloads, Pictures, Music, and Videos. You free C: now, and those folders will not eat C: as they grow.

### 2. Move common app caches

A lot of everyday software installs on C:. Left alone, the caches get absurd. Changing the save path in settings is usually enough to give C: a lot of room back.

**Usual suspects:**

- **WeChat desktop:** group chats and images; tens of GB over time is normal
- **QQ:** chat history and file cache
- **Adobe Photoshop:** scratch disk
- **Browsers:** download folder and cache

In each app, find "file location" or "cache directory" and point it at D: or another volume.

---

## 3. Clean the Windows folder and large files by hand

The steps above already free a lot of cache. Next, go after system space.

![Moving folders from C: to another volume](../../assets/inline-windows-c-drive-cleanup-guide-02.jpg)

### 1. Clean inside the Windows folder

**Difficulty: medium | Safety: high**

#### Temp

**Path:** `C:\Windows\Temp`

Temporary and cache files. Deleting *the files inside* will not break the system.

> **Do not delete the folder itself** — only the contents. If a file will not delete, it is in use; reboot and try again.

#### Log files

**Path:** `C:\Windows\system32\logfiles`

System and software logs. Most people never need them. Safe to delete the contents.

#### Backup

**Path:** `C:\Windows\winsxs\backup`

Software backup copies. Basically unused. Safe to delete the contents.

#### Prefetch

**Path:** `C:\Windows\Prefetch`

Windows prefetches folders you visit. Cleaning it regularly saves space and can make frequently used folders a bit slower to open the next time.

#### Help

**Path:** `C:\Windows\Help`

System help files. Almost nobody uses them. Deleting the contents is a reasonable trade.

> **Again:** do not delete these folders. Delete the files *inside* them.

### 2. Hunt large files

**Difficulty: medium | Safety: high**

#### Windows.edb (search database)

This is the Windows Search service database. It caches search results. If you search a lot, it balloons.

**Path:** `C:\ProgramData\Microsoft\Search\Data\Applications\Windows`

You can delete it; the system will keep running. Or search **Indexing Options** in the Start menu → **Advanced** → rebuild the index to reset the size.

> **Important:** on some machines this file is grotesque — 70–80 GB. Emptying it can save a dying C: drive.

### 3. Turn off hibernation

**Difficulty: medium | Safety: high**

Hibernation writes RAM to a disk cache and eats a lot of space. If C: is tight and you do not need hibernate, turn it off.

**Steps:**

1. Right-click Start → Search → type `cmd`
2. Right-click **Command Prompt** → Run as administrator
3. Run: `powercfg -h off`

Hibernation is off.

To turn it back on: `powercfg -h on`.

### 4. Move the page file off C:

**Difficulty: medium | Safety: medium**

Memory-heavy apps (Photoshop, for example) make Windows carve out disk as a buffer when RAM is short.

**A convenient tool:** Lenovo Smart Solution (联想智能解决工具).

1. Search for "联想智能解决工具"
2. Download the disk-cleanup tool
3. The first item is virtual-memory settings
4. Choose **custom virtual memory** and put it on another volume (D:)
5. Set the maximum a bit larger than physical RAM
6. OK, save, reboot

> **Caution:** if you are new to this, be careful. In some cases it can destabilize the system.

---

## 4. Last-resort options

The methods above should fix C: space for most people.

### Non-destructive repartition (higher risk — not for beginners)

Tools like DiskGenius or Partition Assistant can grow C: without wiping data. There is still risk.

### Replan the partitions (recommended)

Everything above is remediation. The lasting fix is a larger C: in the first place.

**A reasonable split:**

- **Office use:** give the system volume about 100–120 GB
- **Design work** (photo, video, CAD): consider using the whole disk as the system volume — do not partition

Next time you reinstall, back up, delete the partitions, and rebuild. That ends the C: crisis for good.

---

## Summary

A complete C: cleanup, simple to advanced:

1. **Software cleanup** (easiest) — Storage Sense or a third-party cleaner
2. **Move files** (recommended) — personal folders and app caches to another volume
3. **Manual cleanup** (intermediate) — Windows folders and large files
4. **System tweaks** (advanced) — disable hibernate, move the page file
5. **Repartition** (last resort) — plan a larger C: on the next reinstall

Pick the level that matches your skill. Go step by step. Safety first.

---

## Related posts

- [[winpe-pecmd-commands|PECMD commands in WinPE]]
- [[vs-atl-exe-cannot-generate-dll|VS ATL exe template cannot generate a DLL]]

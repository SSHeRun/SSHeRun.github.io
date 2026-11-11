---
title: 'The real pain of AI series production isn’t beauty — it’s “is that still the same person?”'
description: 'A long r/aivideomaking write-up treats character and scene continuity as spatial data, not another prompt lottery. Drift across shots is what kills episodic AI film.'
pubDate: '2026-11-11'
heroImage: '../../assets/cover-ai-series-consistency-pain-en.jpg'
tags: ['LLM', '工具', '思考']
lang: en
translationKey: 'ai-series-consistency-pain'
---

> Source: [How I'm handling character + scene consistency…](https://www.reddit.com/r/aivideomaking/comments/1xo7upe/how_im_handling_character_scene_consistency/) (r/aivideomaking, ~50 upvotes / 32 comments)

An 8-second AI clip is a beauty contest.  
An episode — even a short run of connected shots — flips the metric: **is that still the same face? Is the lamp still where it was?**

Someone on r/aivideomaking laid out a feature-length approach: 56 characters, 87 locations, 115 props, world-built in a Metropolis mood. The comments argue tactics. The pain point barely moves — **the hard part of AI series work isn’t generating; it’s matching.**

## What the pain actually is

![Identity and set drift across cuts](../../assets/inline-ai-series-consistency-pain-01-en.jpg)

Shorts can ride luck: one still, one extend.  
Series can’t. The same character has to survive wides, close-ups, turned backs, and emotional inserts. The same room has to survive reverses, day/night, and “on fire.” The moment the model invents — a new painting, a relocated cereal box, a mushy stranger in the wide — the audience exits.

One comment said it cleanly:

> Treat continuity as structured spatial data (shot → 3D stage → physical lens → verified still → video) rather than gambling with text prompts.

That’s the split from “good at prompting.” Prompts buy a single aesthetic hit. Series need **reusable identity and geography across cuts.**

## The pipeline skeleton worth stealing

![Layered path from clay to video](../../assets/inline-ai-series-consistency-pain-02-en.jpg)

It isn’t one magic model. It’s layered assets, fetched per shot:

1. **Story data as the spine:** every shot encodes who’s doing what and what they feel; expression libraries and framing emphasis grow from that.  
2. **Character refs, not one sheet for everything:** wides lead with full-body (outfit, hair, build); close-ups lead with face. Expressions start from a neutral headshot and describe brows, lids, mouth, jaw, gaze — not just “sad.”  
3. **Locations as plates, not re-descriptions:** keep an establishing frame; prompts lean on action. Text drifts; frames don’t. Stronger still: index camera solves against plates and crop to what that lens actually sees, so the model can’t invent from the whole room.  
4. **3D clay / high-fidelity sets as geometry locks:** grey boxes invite redrawn set dressing every time. High-fidelity Blender, Gaussian splats, and hero props nail what must stay put. Several people found intermediate “cinematic” stills invent background detail that then poisons the video pass — sometimes animatic/plates straight to video holds better.  
5. **Agents as harness, not director:** one agent does, another reviews; humans keep creative calls. The OP says consistency is the scalable side; what they watch for is whether **emotion lands** — consistent and dead still loses.

The post’s scale is the point: ~500 character refs, 85 location states, 61 3D sets… a new story rebuilds data and assets. **What transfers is the workflow, not the Metropolis textures.**

## Field consensus from the thread

![Mushy wides and the per-shot triad](../../assets/inline-ai-series-consistency-pain-03-en.jpg)

- **Small / turned / distant faces lose the lock first** — budget re-renders there; cut closer when the face must read; at distance people ID clothes and hair.  
- **Per-shot sheet: reference / seed / prompt** — when it’s wrong, you know which line moved.  
- **Crowds get their own ref sets**, defined once per scene (count, formation, entry/exit), not reshuffled every shot.  
- **Lighting states are environment variants** (day / night / fire), not hope baked into grey clay.  
- **Mannequins own pose; character sheets own morphology** — full depth/Canny lock at 100% makes people look like the doll; split kinematic intent from identity authority.

(Also: mods hate LLM-soup posts. The pipeline itself is still the real problem with real answers.)

## My take

Shrink “the biggest pain of AI series production” to one line:

**Not resolution — cross-shot identity continuity. Not a stronger text-to-video model — indexable assets for characters, rooms, and camera solves.**

Short-form trained us for one-shot surprise. Series force a different habit: engineer first, direct second — make continuity scalable, then play genre and emotion in previs. The OP’s bet is keepers for a whole film under roughly a grand if the system holds. The thread’s lasting line is simpler: **you don’t prompt your way into narrative length; you build spatial data, then generate.**

## Related posts

- [[ai-era-clarity-matters|The scarcest skill in the AI era: saying things clearly]]
- [[selling-software-still-a-business-ai-vibe|Is selling software a fake problem now?]]
- [[software-not-valuable-ai-era|Is software worthless in the AI era?]]
- [[judge-dev-ability-in-ai-era|How to judge coding ability in the AI era]]

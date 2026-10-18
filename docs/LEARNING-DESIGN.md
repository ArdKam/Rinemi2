# Rinemi 2 — Learning Design and Content Quality

**Status:** Proposed educational acceptance specification.  
**Purpose:** make interface design support valid learning behavior and distinguish verified instruction from speculative memory aids.

## 1. Learning principles

- Use active retrieval rather than relying on repeated exposure alone.
- Present one clear learning objective per exercise.
- Introduce useful meaning and readings without overwhelming a beginner.
- Teach readings through natural, useful vocabulary and context when possible.
- Practice production and discrimination when the learner's goal and evidence justify them.
- Use spaced review through one authoritative scheduler if the existing learning engine is reused.
- Target repeat errors explicitly, then verify improvement later rather than declaring mastery immediately.
- Keep hints helpful but distinct from independent retrieval.
- Make “unknown,” wrong answer, near miss, hint-assisted result, and correct independent recall semantically distinct.
- Adapt to the learner without hiding why a practice mode changed when the explanation would reduce confusion.
- Avoid gamification that rewards only activity count or penalizes missing days.

## 2. Instructional sequence

### Understand
- Give a central learner-facing meaning in natural Persian.
- Preserve source/lexical nuance and distinguish related meanings if needed.
- Explain when a character commonly appears in words rather than displaying every definition at once.

### Retrieve
- Ask the learner to recall the target attribute before exposing the answer.
- Keep prompts unambiguous.
- The hidden answer must not leak through visible UI, accessibility naming, neighboring examples, or misleading focus behavior.
- Support a deliberate reveal action and keyboard shortcut only when clearly signposted and accessible.

### Use
- Use common, useful vocabulary with verified writing, reading and Persian meaning.
- Explain the target character's contribution only when correct and beneficial.
- A reading should be tied to a specific word where ambiguity warrants it.

### Recognize in context
- Use short sentences/passages appropriate to the learner's level.
- Confirm the target answer and distractors are valid in that context.
- Avoid context items with multiple plausible answers unless the task explicitly accepts them.
- Use contextual grammar support only where it unblocks comprehension; do not silently grow a full grammar curriculum.

### Review and recover
- Ratings mean what the scheduler says they mean; the UI must not invent interval implications.
- Recovery exercises are practice, not extra independent success evidence unless the learning contract explicitly defines them.
- Select follow-up work through the authoritative learner-model/planner boundary when reused.
- A correct response after a hint should not be reported as equivalent to independent first-attempt recall.
- Explain the next action without implying the learner has mastered a skill prematurely.

## 3. Learning card information hierarchy

### Unrevealed card
1. Primary kanji/exercise stimulus.
2. One clear instruction/prompt.
3. One primary reveal/answer/submit action.
4. Relevant topic or exercise context only as secondary information.
5. A discoverable unknown/skip path when the underlying task supports one.

### Revealed card
1. Core meaning/answer.
2. Important reading or pronunciation information for the task.
3. One high-value example word or usage clue.
4. Relevant visual contrast/structure where it helps.
5. Optional personal/curated/guided memory aid.
6. Additional reference detail, stroke order, readings, and more examples.
7. Rating/next action with stable position and semantics.

The card is not the entire dictionary. Full reference content belongs in the kanji detail view.

## 4. Practice modes and what each must prove

The existing Rinemi learning design includes Meaning, Reading, Production, Vocabulary, and Context. Keep mode definitions distinct.

- **Meaning:** the learner identifies/produces the intended semantic answer; accepted synonyms and grading normalization must be documented.
- **Reading:** test the reading relevant to the prompt and provide enough context to disambiguate on/kun or word-specific readings.
- **Production:** ask for the intended kanji from a meaning or cue. Typed answer normalization must not accept unrelated characters or incorrectly reject equivalent input without an explained policy.
- **Vocabulary:** target word identity, reading, and meaning should be aligned. A valid content item must have a sufficient correct-answer contract and safe distractors.
- **Context:** blank/selection questions must have one defensible target under the chosen rubric; target and distractors must be supported by sentence semantics and level.

The UI must not independently decide which learning mode is due or which response should alter the authoritative learner state.

## 5. Memory-aid taxonomy

Use explicit categories:
- **Curated mnemonic:** human-selected, reviewed content with a known source and review process.
- **Learner's own mnemonic:** the learner-authored personal memory cue.
- **Guided scaffold:** a prompt that helps the learner invent their own cue; not presented as a completed mnemonic.
- **Visual structure:** observed component information from a verified dataset; not automatically a story or etymology.
- **Confusion aid:** a targeted comparison that identifies the actual visual/reading distinction.

Rules:
- Never conflate these categories in UI labels or data.
- Never claim an invented mnemonic is the historical origin of the kanji.
- Avoid confident component interpretation when the dataset provides only a visual decomposition.
- Prefer no mnemonic over an irrelevant, culturally confusing or misleading story.
- The learner's personal mnemonic must not be overwritten silently by a curated suggestion.
- Display optional aids based on usefulness, not only on whether an entry exists.
- Any AI-generated memory aid remains an untrusted draft until reviewed, and must not enter authoritative content automatically.

## 6. Content model and provenance

Every content type must have a clear source and validation status. At minimum, track where applicable:
- stable content ID;
- Japanese form and normalized form;
- reading(s), including reading scope and the word/context in which it applies;
- source meanings and learner-facing Persian gloss/explanation separately;
- source/provider and source item ID;
- source license/provenance;
- content/source version or last-reviewed date;
- review status and any limitations;
- whether it is source content, reviewed editorial content, learner-created, imported, or a generated draft.

Do not use localized display strings as stable IDs. Do not replace upstream source records silently with an editorial overlay. Preserve original meanings when adding Persian explanations.

## 7. Content-quality acceptance

### Kanji meanings
- Central meaning is accurate, appropriate for level, and not an unhelpful literal gloss.
- Related meanings are grouped or explained rather than presented as a synonym dump.
- Persian is natural and understandable without unnecessary English intermediary terms.
- Japanese nuance is not invented.

### Readings
- Reading labels are accurate.
- Examples prove the reading being taught.
- Irregular/common word readings are represented at word scope, not implied as universal character readings.
- Romaji, if present, follows one documented canonical convention and is not presented as primary Japanese literacy.

### Vocabulary
- Written form, reading and meaning refer to the same word.
- Persian translation is idiomatic and conveys the intended sense.
- Frequency/level claims have an explicit source or are omitted.
- Distractors are grammatically and semantically plausible only when a meaningful test requires them, but not falsely correct under the grading contract.

### Context
- Sentence is natural, licensed, level-appropriate, and has a correct target.
- Translation matches the sentence, not just the target word.
- Alternative valid answers are accounted for.
- Content-provider outage is not represented as absence of content.

### Components and visual structure
- Actual structure data is used.
- Visual similarity is not labeled as linguistic/semantic derivation unless a trustworthy source justifies the claim.
- Diagrams do not rely on color alone.
- Similar-kanji comparisons identify a concrete distinguishing feature.

### Mnemonics
- Relevance to the actual kanji, meanings and readings.
- Clear distinction between curated and guided/generated.
- No false historical claim, harmful cultural shortcut, or confusing metaphor.
- Review sampled across character difficulty and readings, not just easy familiar characters.

## 8. Human QA and correction workflow

- Choose representative samples across JLPT levels/difficulty, on/kun patterns, visually similar groups, vocabulary frequency and source type.
- Have reviewers inspect raw source, user-facing Persian, Japanese form/reading, content use, and UI presentation together.
- Classify findings: critical incorrect answer, high-impact ambiguity, naturalness/translation, source/license, visual display, low-priority wording.
- Block a release for incorrect target answers, invalid readings, illegal/unknown licensing, unsafe import behavior or systematic RTL corruption.
- Log corrections against stable content IDs with before/after, source, rationale, reviewer and date.
- Do not claim complete corpus review from a sample audit.
- Offer a low-friction in-product feedback path while avoiding transmission of personal learner data by default.

## 9. Learning metrics and evidence

Useful metrics to validate, if privacy and product instrumentation are approved:
- first useful exercise completion;
- first-attempt independent accuracy by skill;
- assisted recovery outcome as a separate metric;
- delayed recall for a defined cohort and interval;
- repeated confusion rate for known pairs;
- successful lookup-to-return-to-learning path;
- vocabulary/context success with adequate item validity;
- session completion and return behavior without coercive streak pressure.

Do not equate app engagement with learning. Avoid claims of superior effectiveness until a suitable evaluation design and enough evidence exist. Tests prove software contracts, not educational efficacy.

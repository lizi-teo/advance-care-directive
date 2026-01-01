# ACD Web App Implementation Plan

## Project Overview
A trauma-informed, accessible web application for creating legally compliant Advance Care Directives in NSW, Australia. Built to serve diverse populations with dignity during vulnerable moments.

---

## MVP (Minimum Viable Product)
**Goal:** Launch a functional, legally compliant ACD generator with both paced and fast flows.

### Phase 1: Foundation (Week 1-2)
**Core Infrastructure**

- [ ] Project setup with Next.js, React, Tailwind, Shadcn UI
- [ ] Supabase project initialization
  - Database schema design
  - Authentication setup
  - Row Level Security policies
- [ ] Basic routing structure
  - Landing page
  - Flow selection (paced vs fast)
  - Form pages structure
  - Review/preview page
- [ ] Design system implementation
  - Typography (Crimson Pro, Source Sans 3)
  - Color palette (sage greens, warm off-whites)
  - Reusable Shadcn components
  - Trauma-informed microcopy library

**Deliverable:** Working skeleton with navigation and design system

---

### Phase 2: Form Infrastructure (Week 3)
**Multi-step Form Foundation**

- [ ] React Hook Form integration
- [ ] Form state management strategy
  - Context for form data
  - Progress tracking
  - Step navigation
- [ ] Validation schema setup
- [ ] Progress indicator component
- [ ] Auto-save mechanism (for logged-in users)
- [ ] Data persistence layer
  - Local storage (fast flow)
  - Supabase (paced flow)

**Deliverable:** Working form navigation with save/restore

---

### Phase 3: Core Content Sections (Week 4-5)
**The Heart of the ACD**

- [ ] **Section 1: About You**
  - Basic information fields
  - Legal name, contact details
  - Relationship status (if relevant)

- [ ] **Section 2: Values Assessment**
  - Quality of life questions
  - What matters most interface
  - Progressive disclosure of legal context
  - Optional reflection prompts

- [ ] **Section 3: Healthcare Wishes**
  - Treatment preferences (plain English)
  - Life-sustaining treatment decisions
  - Comfort care priorities
  - Free-text fields for personal wishes

- [ ] **Section 4: Decision Makers**
  - Appointed person(s) selection
  - Contact information
  - Backup appointments
  - Authority scope definition

- [ ] **Section 5: Additional Instructions**
  - Cultural/spiritual considerations
  - Specific medical preferences
  - Organ donation
  - Funeral wishes (optional)

**Deliverable:** Complete form content with validation

---

### Phase 4: User Authentication (Week 6)
**Dual Flow Implementation**

- [ ] Auth UI components
  - Sign up
  - Log in
  - Password reset
  - Social auth (optional)

- [ ] Fast flow (accountless)
  - Progress in local storage
  - Optional signup at completion
  - Data migration if user signs up

- [ ] Paced flow (account-required)
  - Dashboard for saved drafts
  - Progress tracking
  - Last saved indicator
  - Resume from where you left off

- [ ] Session management
  - Inactivity warnings
  - Auto-save intervals
  - Data loss prevention

**Deliverable:** Both flows fully functional

---

### Phase 5: PDF Generation (Week 7)
**The Critical Output**

- [ ] PDF template design
  - NSW legal requirements
  - Clear, readable layout
  - Accessible formatting
  - Official appearance

- [ ] react-pdf implementation
  - Dynamic content rendering
  - User data population
  - Signature lines
  - Witness sections

- [ ] PDF generation API route
  - Server-side rendering
  - Error handling
  - Download endpoint

- [ ] Preview functionality
  - Review before download
  - Edit capability
  - Version control

**Deliverable:** Users can generate and download legal PDF

---

### Phase 6: Polish & Launch Prep (Week 8)
**Making It Ready**

- [ ] Trauma-informed features
  - Optional breathing exercises component
  - Gentle microcopy throughout
  - "Save and return" messaging
  - Supportive error states

- [ ] Accessibility audit
  - Screen reader testing
  - Keyboard navigation
  - Color contrast
  - Font sizing for older adults

- [ ] Legal compliance review
  - NSW ACD requirements checklist
  - Legal language accuracy
  - Required disclaimers

- [ ] Error handling
  - Network failures
  - Validation errors
  - Save failures
  - Graceful degradation

- [ ] Testing
  - User testing with target demographics
  - Cross-browser testing
  - Mobile responsiveness
  - Form completion flows

**Deliverable:** Production-ready MVP

---

## Post-MVP: Enhanced Features

### Phase 7: AI Text Enhancement (Month 3)
**Optional Writing Support**

- [ ] Claude API integration
  - API route setup
  - Rate limiting
  - Error handling
  - Cost monitoring

- [ ] Enhancement UI
  - User-triggered suggestions
  - Side-by-side comparison
  - Accept/reject interface
  - "Keep my voice" emphasis

- [ ] Smart cleanup features
  - Grammar improvement
  - Clarity enhancement
  - Preserve user intent
  - Never replace, only suggest

**Priority:** Medium (nice-to-have, not critical)

---

### Phase 8: Contextual Support (Month 4)
**Helping Users Navigate Difficulty**

- [ ] Journaling prompts
  - Optional reflection questions
  - Values clarification exercises
  - Decision-making support

- [ ] Educational content
  - NSW legal context
  - Common questions
  - Healthcare terminology
  - Progressive disclosure

- [ ] Breathing exercises
  - Simple guided techniques
  - Accessible during any step
  - Non-intrusive design

- [ ] Resource library
  - External support services
  - Palliative care information
  - Legal aid contacts

**Priority:** High (enhances trauma-informed approach)

---

### Phase 9: Document Management (Month 5)
**After Creation**

- [ ] Document versioning
  - Edit existing ACDs
  - Track changes
  - Version history
  - Regenerate PDFs

- [ ] Sharing functionality
  - Secure link generation
  - Email to healthcare providers
  - Share with family (optional)
  - Access control

- [ ] Reminders
  - Review prompts (annual)
  - Update encouragement
  - Life event triggers

- [ ] Storage dashboard
  - Multiple drafts
  - Completed documents
  - Archive old versions

**Priority:** Medium-High (user retention)

---

## Long-Term Vision

### Phase 10: Community Features (Month 6-8)
**Building Support Networks**

- [ ] User stories/testimonials
  - Optional sharing
  - Anonymized experiences
  - Reduce stigma

- [ ] Healthcare provider portal
  - Access patient ACDs (with permission)
  - Integration with health systems
  - Professional feedback loop

- [ ] Family/support person features
  - Collaborative completion
  - Shared understanding tools
  - Family meeting guides

**Priority:** Low-Medium (community building)

---

### Phase 11: Advanced Accessibility (Month 9-10)
**Expanding Reach**

- [ ] Multilingual support
  - CALD community languages
  - Translation interface
  - Cultural adaptation

- [ ] Voice navigation
  - Full voice control option
  - For users with mobility limitations
  - Beyond just text input

- [ ] Simplified mode
  - For cognitive accessibility
  - Ultra-minimal interface
  - Guided assistance

- [ ] Offline capability
  - Progressive Web App
  - Work without connection
  - Sync when online

**Priority:** High (mission-aligned)

---

### Phase 12: Integration & Scale (Month 11-12)
**Healthcare System Integration**

- [ ] EMR integration
  - Hospital system connections
  - GP software compatibility
  - Automatic updates

- [ ] Legal partnerships
  - Verification services
  - Notary connections
  - Legal review options

- [ ] Analytics & Impact
  - Usage metrics
  - Completion rates
  - User demographics
  - Impact measurement (non-intrusive)

- [ ] Mobile apps
  - iOS/Android native
  - Or PWA enhancement
  - Offline-first approach

**Priority:** Medium (scale & sustainability)

---

## Success Metrics

### MVP Launch Targets
- Completion rate: >60% of started forms
- Time to complete: 30-45 mins (fast) / completion within 2 weeks (paced)
- User satisfaction: >4/5 stars
- Legal compliance: 100% of generated documents meet NSW requirements
- Accessibility: WCAG 2.1 AA compliance

### Long-term Goals
- ACDs created: 10,000+ in Year 1
- Healthcare provider adoption: Partner with 50+ practices
- Community reach: Serve 10+ CALD communities
- User retention: 40%+ return to update their ACD
- Cost: Free for all users (funded by grants/donations)

---

## Technical Debt & Maintenance

### Ongoing Tasks
- [ ] Regular dependency updates
- [ ] Security patches
- [ ] Performance monitoring
- [ ] User feedback review
- [ ] Legal requirement updates
- [ ] Accessibility audits
- [ ] Cost optimization (Supabase, API usage)

### Documentation Needs
- [ ] User guides
- [ ] Healthcare provider resources
- [ ] Developer documentation
- [ ] API documentation (if opened)
- [ ] Contributing guidelines (if open source)

---

## Risk Mitigation

### Legal Risks
- Regular legal review of templates
- Clear disclaimers about legal advice
- Partnership with NSW legal aid
- Version control for legal changes

### Technical Risks
- Supabase backup strategy
- PDF generation fallbacks
- API rate limiting
- Data privacy compliance (Australian Privacy Act)

### User Safety Risks
- Crisis resource links visible
- Beyond Blue/Lifeline contacts
- Mental health professional partnerships
- Content warnings where appropriate

---

## Notes on Approach

**Trauma-Informed Principles Throughout:**
- Every feature decision: "Could this harm someone in crisis?"
- Default to less pressure, more agency
- Make support optional, never mandatory
- Preserve user voice and dignity

**Accessibility First:**
- Test with actual older adults and CALD users
- Never sacrifice clarity for aesthetics
- Progressive enhancement, not "cool features"
- Mobile-first, senior-friendly design

**Sustainable Development:**
- You're building alone - pace yourself
- Ship MVPs of features, iterate based on feedback
- Don't gold-plate - "good enough" is okay
- Community feedback > personal perfectionism

---

**Last Updated:** [Date]
**Next Review:** [Date]
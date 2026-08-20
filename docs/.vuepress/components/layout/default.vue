<template>
  <s-layout
    class="layout-demo"
    min-height="430px"
    aside-width="168px"
    :gap="12"
    :padding="12"
  >
    <template #header>
      <div class="layout-demo__brand">
        <span class="layout-demo__logo">S</span>
        <span>Sax Workspace</span>
      </div>
      <div class="layout-demo__header-actions">
        <span class="layout-demo__status">All systems normal</span>
        <span class="layout-demo__avatar">LM</span>
      </div>
    </template>

    <template #aside>
      <p class="layout-demo__aside-label">Workspace</p>
      <nav class="layout-demo__nav" aria-label="Demo navigation">
        <a class="is-active" href="#overview">Overview</a>
        <a href="#projects">Projects</a>
        <a href="#activity">Activity</a>
        <a href="#settings">Settings</a>
      </nav>
      <div class="layout-demo__storage">
        <span>Storage</span>
        <strong>64%</strong>
        <i><b /></i>
      </div>
    </template>

    <section class="layout-demo__main">
      <div class="layout-demo__heading">
        <div>
          <span class="layout-demo__eyebrow">Wednesday, 19 August</span>
          <h3>Good morning, Lina</h3>
        </div>
        <button type="button">New project</button>
      </div>

      <div class="layout-demo__metrics">
        <article>
          <span>Active projects</span>
          <strong>24</strong>
          <small>+4 this week</small>
        </article>
        <article>
          <span>Completion</span>
          <strong>86%</strong>
          <small>Above target</small>
        </article>
        <article>
          <span>Team focus</span>
          <strong>92</strong>
          <small>Healthy pace</small>
        </article>
      </div>

      <div class="layout-demo__panel">
        <div>
          <strong>Website redesign</strong>
          <span>Design system · 8 tasks</span>
        </div>
        <span class="layout-demo__pill">In progress</span>
      </div>
      <div class="layout-demo__panel">
        <div>
          <strong>Mobile onboarding</strong>
          <span>Product design · 5 tasks</span>
        </div>
        <span class="layout-demo__pill is-review">Review</span>
      </div>
    </section>

    <template #footer>
      <span>Updated just now</span>
      <span class="layout-demo__footer-note">Sax Design workspace</span>
    </template>
  </s-layout>
</template>

<style scoped>
.layout-demo {
  color: #17223b;
  font-size: 12px;
}

.layout-demo__brand,
.layout-demo__header-actions,
.layout-demo__heading,
.layout-demo__panel,
.layout-demo :deep(.s-layout-footer) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.layout-demo__brand {
  gap: 9px;
  font-weight: 700;
}

.layout-demo__logo,
.layout-demo__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  background: rgba(25, 91, 255, 0.12);
  color: #195bff;
  font-weight: 800;
}

.layout-demo__logo {
  width: 28px;
  height: 28px;
  border-radius: 9px;
  box-shadow: 0 8px 16px -10px rgba(25, 91, 255, 0.7);
}

.layout-demo__header-actions {
  gap: 12px;
  margin-left: auto;
}

.layout-demo__status {
  color: #4b5d7b;
}

.layout-demo__status::before {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: #36b37e;
  content: '';
}

.layout-demo__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.layout-demo__aside-label,
.layout-demo__eyebrow {
  margin: 0 0 10px;
  color: #7583a0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.layout-demo__nav {
  display: grid;
  gap: 5px;
}

.layout-demo__nav a {
  padding: 9px 11px;
  border-radius: 10px;
  color: #5f6d88;
  font-weight: 600;
  text-decoration: none;
}

.layout-demo__nav a.is-active {
  background: rgba(25, 91, 255, 0.12);
  color: #195bff;
  box-shadow: 0 8px 18px -14px rgba(25, 91, 255, 0.8);
}

.layout-demo__storage {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin-top: 38px;
  color: #64738f;
}

.layout-demo__storage strong {
  color: #263653;
}

.layout-demo__storage i {
  grid-column: 1 / -1;
  height: 5px;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(25, 91, 255, 0.1);
}

.layout-demo__storage b {
  display: block;
  width: 64%;
  height: 100%;
  border-radius: inherit;
  background: #195bff;
}

.layout-demo__main {
  display: grid;
  gap: 13px;
}

.layout-demo__heading h3 {
  margin: 2px 0 0;
  font-size: 18px;
  line-height: 1.25;
}

.layout-demo__eyebrow {
  margin: 0;
}

.layout-demo__heading button {
  min-height: 34px;
  padding: 0 14px;
  border: 0;
  border-radius: 11px;
  background: #195bff;
  color: #fff;
  box-shadow: 0 10px 22px -12px rgba(25, 91, 255, 0.8);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}

.layout-demo__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.layout-demo__metrics article,
.layout-demo__panel {
  border-radius: 13px;
  background: rgba(25, 91, 255, 0.045);
  box-shadow: 0 10px 24px -20px rgba(25, 50, 110, 0.8);
}

.layout-demo__metrics article {
  display: grid;
  gap: 3px;
  padding: 11px 12px;
}

.layout-demo__metrics article > span,
.layout-demo__panel span {
  color: #687793;
}

.layout-demo__metrics strong {
  font-size: 20px;
}

.layout-demo__metrics small {
  color: #3b8c70;
}

.layout-demo__panel {
  padding: 11px 13px;
}

.layout-demo__panel > div {
  display: grid;
  gap: 3px;
}

.layout-demo__pill {
  padding: 5px 8px;
  border-radius: 99px;
  background: rgba(25, 91, 255, 0.1);
  color: #195bff !important;
  font-size: 10px;
  font-weight: 700;
}

.layout-demo__pill.is-review {
  background: rgba(255, 166, 0, 0.12);
  color: #9d6500 !important;
}

.layout-demo :deep(.s-layout-footer) {
  width: 100%;
  color: #6a7892;
}

.layout-demo__footer-note {
  margin-left: auto;
}

@media (max-width: 767px) {
  .layout-demo__status,
  .layout-demo__footer-note {
    display: none;
  }

  .layout-demo__metrics {
    grid-template-columns: 1fr;
  }
}
</style>

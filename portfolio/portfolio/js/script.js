// ---- Mobile menu ----
const menuBtn = document.getElementById('menu-btn');
const navList = document.getElementById('nav-list');
menuBtn.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// ---- Academic planner ----
const taskForm = document.getElementById('task-form');
if (taskForm) {
  const input = document.getElementById('task-input');
  const dateInput = document.getElementById('task-date');
  const list = document.getElementById('task-list');
  const stats = document.getElementById('task-stats');
  const err = document.getElementById('task-err');
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem('tasks')) || []; } catch (e) { tasks = []; }

  function save() {
    try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) {}
  }

  function render() {
    list.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');
      const box = document.createElement('input');
      box.type = 'checkbox'; box.checked = task.done;
      box.setAttribute('aria-label', 'Mark "' + task.text + '" as completed');
      box.addEventListener('change', () => toggleTask(task.id));
      const t = document.createElement('span');
      t.className = 't'; t.textContent = task.text;
      if (task.date) { const s = document.createElement('small'); s.textContent = 'Due ' + task.date; t.appendChild(s); }
      const del = document.createElement('button');
      del.className = 'del'; del.textContent = 'Delete';
      del.addEventListener('click', () => deleteTask(task.id));
      li.append(box, t, del);
      list.appendChild(li);
    });
    const done = tasks.filter(t => t.done).length;
    stats.textContent = tasks.length ? done + ' of ' + tasks.length + ' tasks completed' : 'No tasks yet. Add your first task above.';
  }

  function addTask(text, date) { tasks.push({ id: Date.now(), text, date, done: false }); save(); render(); }
  function toggleTask(id) { tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); save(); render(); }
  function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); save(); render(); }

  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { err.textContent = 'Enter a task before adding it.'; return; }
    err.textContent = '';
    addTask(text, dateInput.value);
    taskForm.reset(); input.focus();
  });
  render();
}

// ---- Contact form validation ----
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnly = /^\d+$/;
  const rules = {
    name: v => v ? '' : 'Enter your name.',
    email: v => !v ? 'Enter your email address.' : (emailPattern.test(v) ? '' : 'Enter a valid email, like name@example.com.'),
    phone: v => !v ? 'Enter your phone number.' : (digitsOnly.test(v) ? '' : 'Use digits only, with no spaces or symbols.'),
    message: v => v ? '' : 'Write a message.'
  };

  function check(field) {
    const el = contactForm.elements[field];
    const msg = rules[field](el.value.trim());
    contactForm.querySelector('[data-for="' + field + '"]').textContent = msg;
    el.classList.toggle('invalid', Boolean(msg));
    return !msg;
  }

  Object.keys(rules).forEach(f => contactForm.elements[f].addEventListener('blur', () => check(f)));

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).every(Boolean);
    const box = document.getElementById('form-ok');
    if (ok) {
      box.textContent = 'Thank you, ' + contactForm.elements.name.value.trim() + '. Your message has been sent.';
      box.style.display = 'block';
      contactForm.reset();
    } else { box.style.display = 'none'; }
  });
}

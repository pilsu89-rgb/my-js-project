const STORAGE_KEYS = {
  username: "orbitDeskUsername",
  todos: "orbitDeskTodos"
};

const backgroundImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2400&q=80"
];

const weatherNames = {
  0: "맑음",
  1: "대체로 맑음",
  2: "구름 조금",
  3: "흐림",
  45: "안개",
  48: "서리 안개",
  51: "약한 이슬비",
  53: "이슬비",
  55: "강한 이슬비",
  61: "약한 비",
  63: "비",
  65: "강한 비",
  71: "약한 눈",
  73: "눈",
  75: "강한 눈",
  80: "소나기",
  81: "강한 소나기",
  82: "매우 강한 소나기",
  95: "천둥번개",
  96: "우박 동반 천둥번개",
  99: "강한 우박 동반 천둥번개"
};

const loginCard = document.querySelector("#login-card");
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-input");
const logoutButton = document.querySelector("#logout-button");

const dashboard = document.querySelector("#dashboard");
const greeting = document.querySelector("#greeting");
const focusMessage = document.querySelector("#focus-message");

const clock = document.querySelector("#clock");
const today = document.querySelector("#today");

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");
const doneCount = document.querySelector("#done-count");
const totalCount = document.querySelector("#total-count");

const weatherPlace = document.querySelector("#weather-place");
const weatherTemp = document.querySelector("#weather-temp");
const weatherDesc = document.querySelector("#weather-desc");

let todos = loadTodos();

function setRandomBackground() {
  const selectedImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  document.documentElement.style.setProperty("--bg-image", `url("${selectedImage}")`);
}

function padTime(value) {
  return String(value).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  const hours = padTime(now.getHours());
  const minutes = padTime(now.getMinutes());
  const seconds = padTime(now.getSeconds());
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  clock.textContent = `${hours}:${minutes}:${seconds}`;
  today.textContent = `${now.getFullYear()}년 ${padTime(now.getMonth() + 1)}월 ${padTime(now.getDate())}일 ${weekdays[now.getDay()]}`;
}

function getGreetingText(name) {
  const hour = new Date().getHours();

  if (hour < 6) {
    return `깊은 밤이에요, ${name}님.`;
  }

  if (hour < 12) {
    return `상쾌한 아침이에요, ${name}님.`;
  }

  if (hour < 18) {
    return `집중하기 좋은 오후예요, ${name}님.`;
  }

  return `차분한 저녁이에요, ${name}님.`;
}

function getFocusText() {
  const messages = [
    "완벽한 계획보다 하나의 완료가 더 강합니다.",
    "지금 적은 일을 오늘의 기준점으로 삼아보세요.",
    "큰 목표는 작게 쪼갤수록 실제로 움직입니다.",
    "미루던 일을 10분만 붙잡아도 흐름이 바뀝니다.",
    "할 일을 줄이는 것도 생산성입니다."
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

function showDashboard(name) {
  loginCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
  logoutButton.classList.remove("hidden");
  greeting.textContent = getGreetingText(name);
  focusMessage.textContent = getFocusText();
  renderTodos();
}

function showLogin() {
  dashboard.classList.add("hidden");
  logoutButton.classList.add("hidden");
  loginCard.classList.remove("hidden");
  loginInput.value = "";
  loginInput.focus();
}

function handleLogin(event) {
  event.preventDefault();

  const username = loginInput.value.trim();

  if (!username) {
    loginCard.classList.remove("shake");
    void loginCard.offsetWidth;
    loginCard.classList.add("shake");
    return;
  }

  localStorage.setItem(STORAGE_KEYS.username, username);
  showDashboard(username);
}

function handleLogout() {
  localStorage.removeItem(STORAGE_KEYS.username);
  showLogin();
}

function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEYS.todos));

    if (Array.isArray(savedTodos)) {
      return savedTodos;
    }

    return [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEYS.todos, JSON.stringify(todos));
}

function createTodoId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addTodo(text) {
  todos.unshift({
    id: createTodoId(),
    text,
    done: false,
    createdAt: Date.now()
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        done: !todo.done
      };
    }

    return todo;
  });

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function handleTodoSubmit(event) {
  event.preventDefault();

  const todoText = todoInput.value.trim();

  if (!todoText) {
    todoInput.focus();
    return;
  }

  addTodo(todoText);
  todoInput.value = "";
  todoInput.focus();
}

function renderTodos() {
  todoList.innerHTML = "";

  const completedCount = todos.filter((todo) => todo.done).length;

  doneCount.textContent = completedCount;
  totalCount.textContent = todos.length;
  emptyMessage.classList.toggle("hidden", todos.length > 0);

  todos.forEach((todo) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    const doneButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    item.className = "todo-item";
    item.dataset.id = todo.id;

    if (todo.done) {
      item.classList.add("done");
    }

    text.className = "todo-text";
    text.textContent = todo.text;

    doneButton.className = "todo-action done-button";
    doneButton.type = "button";
    doneButton.textContent = todo.done ? "되돌리기" : "완료";

    deleteButton.className = "todo-action delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";

    item.append(text, doneButton, deleteButton);
    todoList.appendChild(item);
  });
}

function handleTodoClick(event) {
  const button = event.target.closest("button");
  const item = event.target.closest(".todo-item");

  if (!button || !item) {
    return;
  }

  const todoId = item.dataset.id;

  if (button.classList.contains("done-button")) {
    toggleTodo(todoId);
    return;
  }

  if (button.classList.contains("delete-button")) {
    deleteTodo(todoId);
  }
}

function setWeatherMessage(place, temp, desc) {
  weatherPlace.textContent = place;
  weatherTemp.textContent = temp;
  weatherDesc.textContent = desc;
}

function getWeather() {
  if (!navigator.geolocation) {
    setWeatherMessage("위치 사용 불가", "--°C", "브라우저가 위치 기능을 지원하지 않음");
    return;
  }

  navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 600000
  });
}

async function handlePositionSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
  const locationUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=ko&format=json`;

  try {
    const [weatherResponse, locationResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(locationUrl)
    ]);

    if (!weatherResponse.ok) {
      throw new Error("weather request failed");
    }

    const weatherData = await weatherResponse.json();
    const locationData = locationResponse.ok ? await locationResponse.json() : null;

    const current = weatherData.current;
    const placeData = locationData && locationData.results ? locationData.results[0] : null;
    const placeName = placeData ? [placeData.name, placeData.admin1].filter(Boolean).join(", ") : "현재 위치";
    const temperature = Math.round(current.temperature_2m);
    const weatherCode = current.weather_code;

    setWeatherMessage(placeName, `${temperature}°C`, weatherNames[weatherCode] || "날씨 정보 확인");
  } catch {
    setWeatherMessage("날씨 오류", "--°C", "잠시 후 다시 시도하세요");
  }
}

function handlePositionError(error) {
  if (error.code === error.PERMISSION_DENIED) {
    setWeatherMessage("위치 권한 필요", "--°C", "브라우저에서 위치를 허용하세요");
    return;
  }

  if (error.code === error.TIMEOUT) {
    setWeatherMessage("위치 지연", "--°C", "위치 확인 시간이 초과됨");
    return;
  }

  setWeatherMessage("위치 확인 실패", "--°C", "현재 위치를 가져올 수 없음");
}

function init() {
  setRandomBackground();
  updateClock();
  setInterval(updateClock, 1000);
  getWeather();

  const savedUsername = localStorage.getItem(STORAGE_KEYS.username);

  if (savedUsername) {
    showDashboard(savedUsername);
  } else {
    showLogin();
  }

  loginForm.addEventListener("submit", handleLogin);
  logoutButton.addEventListener("click", handleLogout);
  todoForm.addEventListener("submit", handleTodoSubmit);
  todoList.addEventListener("click", handleTodoClick);
}

init();
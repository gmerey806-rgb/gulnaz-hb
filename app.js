// ========================================
// SMARTBUS - MAIN JAVASCRIPT
// ========================================


// ---------- TOAST MESSAGE ----------

function showMessage(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.smartBusToastTimer);

    window.smartBusToastTimer = setTimeout(function() {
        toast.classList.remove("show");
    }, 2500);
}


// ---------- PATH HELPERS ----------

function isInsidePagesFolder() {
    return window.location.pathname.includes("/pages/");
}

function pagePath(page) {
    if (isInsidePagesFolder()) {
        return page;
    }

    return "pages/" + page;
}

function homePath() {
    if (isInsidePagesFolder()) {
        return "../index.html";
    }

    return "index.html";
}


// ---------- SWAP CITIES ----------

function swapCities() {
    const from =
        document.getElementById("fromCity");

    const to =
        document.getElementById("toCity");

    if (!from || !to) {
        showMessage("⚠ Қала таңдауы табылмады");
        return;
    }

    const temporaryValue = from.value;

    from.value = to.value;
    to.value = temporaryValue;

    showMessage("Бағыттар ауыстырылды ⇄");
}


// ---------- SEARCH BUS ----------

function searchBus() {
    const from =
        document.getElementById("fromCity");

    const to =
        document.getElementById("toCity");

    const date =
        document.getElementById("tripDate");

    if (!from || !to) {
        showMessage("⚠ Бағыт таңдау өрістері табылмады");
        return;
    }

    if (!from.value || !to.value) {
        showMessage("⚠ Қайдан және қайда қалаларын таңдаңыз");
        return;
    }

    if (from.value === to.value) {
        showMessage(
            "⚠ Қайдан және қайда қалалары әртүрлі болуы керек!"
        );

        return;
    }

    localStorage.setItem(
        "smartbus_from",
        from.value
    );

    localStorage.setItem(
        "smartbus_to",
        to.value
    );

    localStorage.setItem(
        "fromCity",
        from.value
    );

    localStorage.setItem(
        "toCity",
        to.value
    );

    if (date && date.value) {
        localStorage.setItem(
            "smartbus_date",
            date.value
        );

        localStorage.setItem(
            "tripDate",
            date.value
        );
    }

    showMessage("Рейстер ізделуде...");

    setTimeout(function() {
        window.location.href = pagePath("routes.html");
    }, 700);
}


// ---------- OPEN BOOKING ----------

function openBooking() {
    localStorage.setItem(
        "selectedRoute",
        "Ақтөбе → Алматы"
    );

    localStorage.setItem(
        "booking_from",
        "Ақтөбе"
    );

    localStorage.setItem(
        "booking_to",
        "Алматы"
    );

    window.location.href = pagePath("booking.html");
}


// ---------- BOOK ROUTE ----------

function bookRoute(
    route,
    busNumber = "",
    from = "",
    to = "",
    time = "",
    price = "",
    company = ""
) {
    localStorage.setItem(
        "selectedRoute",
        route
    );

    if (busNumber) {
        localStorage.setItem(
            "booking_bus_number",
            busNumber
        );
    }

    if (from) {
        localStorage.setItem(
            "booking_from",
            from
        );
    }

    if (to) {
        localStorage.setItem(
            "booking_to",
            to
        );
    }

    if (time) {
        localStorage.setItem(
            "booking_time",
            time
        );
    }

    if (price) {
        localStorage.setItem(
            "booking_price",
            price
        );
    }

    if (company) {
        localStorage.setItem(
            "booking_company",
            company
        );
    }

    showMessage("✓ Билет брондау беті ашылуда...");

    setTimeout(function() {
        window.location.href = pagePath("booking.html");
    }, 500);
}


// ---------- SELECT ROUTE ----------

function selectRoute(route) {
    localStorage.setItem(
        "selectedRoute",
        route
    );

    showMessage("✓ Бағыт таңдалды");

    setTimeout(function() {
        window.location.href = pagePath("booking.html");
    }, 500);
}


// ---------- ROUTE FILTER ----------

function filterRoutes() {
    const searchInput =
        document.getElementById("routeSearch");

    const timeFilter =
        document.getElementById("timeFilter");

    const routesContainer =
        document.getElementById("routesContainer");

    if (!searchInput || !routesContainer) {
        showMessage("⚠ Рейстер тізімі табылмады");
        return;
    }

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const time =
        timeFilter
            ? timeFilter.value
            : "all";

    const routes =
        routesContainer.querySelectorAll(
            ".route-card, .bus-card"
        );

    let found = 0;

    routes.forEach(function(route) {
        const routeText =
            (
                route.dataset.route ||
                route.dataset.from ||
                route.textContent ||
                ""
            ).toLowerCase();

        const routeTime =
            route.dataset.time ||
            "";

        const matchName =
            routeText.includes(search);

        const matchTime =
            time === "all" ||
            routeTime === time ||
            !routeTime;

        if (matchName && matchTime) {
            route.style.display = "";
            found++;
        } else {
            route.style.display = "none";
        }
    });

    if (found === 0) {
        showMessage(
            "Сұраныс бойынша рейс табылмады"
        );
    } else {
        showMessage(
            found + " рейс табылды"
        );
    }
}


// ---------- LOAD SELECTED ROUTE ----------

function loadSelectedRoute() {
    const routeSelect =
        document.getElementById("selectedRoute");

    const savedRoute =
        localStorage.getItem("selectedRoute");

    if (!routeSelect || !savedRoute) {
        return;
    }

    const options =
        Array.from(routeSelect.options);

    const option =
        options.find(function(item) {
            return item.textContent.trim() === savedRoute;
        });

    if (option) {
        routeSelect.value = option.value;
    }
}


// ---------- LOAD SEARCH DATA ----------

function loadSearchData() {
    const from =
        localStorage.getItem("smartbus_from") ||
        localStorage.getItem("fromCity");

    const to =
        localStorage.getItem("smartbus_to") ||
        localStorage.getItem("toCity");

    const date =
        localStorage.getItem("smartbus_date") ||
        localStorage.getItem("tripDate");

    const fromInput =
        document.getElementById("from");

    const toInput =
        document.getElementById("to");

    const fromCity =
        document.getElementById("fromCity");

    const toCity =
        document.getElementById("toCity");

    const dateInput =
        document.getElementById("date");

    const tripDate =
        document.getElementById("tripDate");

    if (fromInput && from) {
        fromInput.value = from;
    }

    if (toInput && to) {
        toInput.value = to;
    }

    if (fromCity && from) {
        fromCity.value = from;
    }

    if (toCity && to) {
        toCity.value = to;
    }

    if (dateInput && date) {
        dateInput.value = date;
    }

    if (tripDate && date) {
        tripDate.value = date;
    }
}


// ---------- LOAD BOOKING DATA ----------

function loadBookingData() {
    const from =
        localStorage.getItem("booking_from");

    const to =
        localStorage.getItem("booking_to");

    const busNumber =
        localStorage.getItem("booking_bus_number");

    const time =
        localStorage.getItem("booking_time");

    const price =
        localStorage.getItem("booking_price");

    const routeFrom =
        document.getElementById("routeFrom");

    const routeTo =
        document.getElementById("routeTo");

    const summaryFrom =
        document.getElementById("summaryFrom");

    const summaryTo =
        document.getElementById("summaryTo");

    const summaryBus =
        document.getElementById("summaryBus");

    const summaryTime =
        document.getElementById("summaryTime");

    const routeBusNumber =
        document.getElementById("routeBusNumber");

    const routeTime =
        document.getElementById("routeTime");

    const routePrice =
        document.getElementById("routePrice");

    if (routeFrom && from) {
        routeFrom.textContent = from;
    }

    if (routeTo && to) {
        routeTo.textContent = to;
    }

    if (summaryFrom && from) {
        summaryFrom.textContent = from;
    }

    if (summaryTo && to) {
        summaryTo.textContent = to;
    }

    if (summaryBus && busNumber) {
        summaryBus.textContent = busNumber;
    }

    if (summaryTime && time) {
        summaryTime.textContent = time;
    }

    if (routeBusNumber && busNumber) {
        routeBusNumber.textContent = busNumber;
    }

    if (routeTime && time) {
        routeTime.textContent = time;
    }

    if (routePrice && price) {
        routePrice.textContent = price;
    }
}


// ---------- LOAD DATE ----------

function loadBookingDate() {
    const savedDate =
        localStorage.getItem("tripDate") ||
        localStorage.getItem("smartbus_date");

    const bookingDate =
        document.getElementById("bookingDate");

    const dateInput =
        document.getElementById("date");

    if (bookingDate && savedDate) {
        bookingDate.value = savedDate;
    }

    if (dateInput && savedDate) {
        dateInput.value = savedDate;
    }
}


// ---------- AUTO DATE ----------

function setMinimumDates() {
    const dateInputs =
        document.querySelectorAll(
            'input[type="date"]'
        );

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dateInputs.forEach(function(input) {
        input.min = today;
    });
}


// ---------- NAVIGATION ----------

function goHome() {
    window.location.href = homePath();
}

function goRoutes() {
    window.location.href = pagePath("routes.html");
}

function goBooking() {
    window.location.href = pagePath("booking.html");
}

function goLogin() {
    window.location.href = pagePath("login.html");
}

function goAdmin() {
    window.location.href = pagePath("admin.html");
}


// ---------- ADMIN ROUTES ----------

function addRoute() {
    showMessage(
        "Жаңа рейс қосу терезесі ашылды"
    );
}

function deleteRoute(route) {
    const confirmDelete =
        confirm(
            route +
            " рейсін өшіруге сенімдісіз бе?"
        );

    if (confirmDelete) {
        showMessage(
            "✓ Рейс өшірілді"
        );
    }
}


// ---------- LANGUAGE ----------

function changeLanguage() {
    showMessage(
        "Қазақ тілі таңдалды 🇰🇿"
    );
}


// ---------- LOGOUT ----------

function logout() {
    const answer =
        confirm(
            "Admin аккаунтынан шығу керек пе?"
        );

    if (!answer) {
        return;
    }

    localStorage.removeItem(
        "smartbus_user"
    );

    showMessage(
        "Жүйеден шықтыңыз"
    );

    setTimeout(function() {
        window.location.href =
            pagePath("login.html");
    }, 700);
}


// ---------- BUTTON EVENT CONNECTION ----------

function connectButtons() {
    const searchForm =
        document.getElementById("searchForm");

    if (searchForm) {
        searchForm.addEventListener(
            "submit",
            function(event) {
                event.preventDefault();
                searchBus();
            }
        );
    }

    const searchButton =
        document.getElementById("searchButton");

    if (searchButton) {
        searchButton.addEventListener(
            "click",
            function(event) {
                event.preventDefault();
                searchBus();
            }
        );
    }

    const swapButton =
        document.getElementById("swapButton");

    if (swapButton) {
        swapButton.addEventListener(
            "click",
            function(event) {
                event.preventDefault();
                swapCities();
            }
        );
    }

    document
        .querySelectorAll("[data-page]")
        .forEach(function(button) {
            button.addEventListener(
                "click",
                function() {
                    const page =
                        button.dataset.page;

                    if (page) {
                        window.location.href =
                            pagePath(page);
                    }
                }
            );
        });
}


// ---------- INITIALIZATION ----------

document.addEventListener(
    "DOMContentLoaded",
    function() {
        loadSelectedRoute();
        loadSearchData();
        loadBookingData();
        loadBookingDate();
        setMinimumDates();
        connectButtons();

        console.log(
            "SmartBus жүйесі іске қосылды."
        );
    }
);
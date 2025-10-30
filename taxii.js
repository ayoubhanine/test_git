// === Données d'entrée ===
let taxis = [
  { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 },
];

let requests = [
  { reqId: 1, position: 10, duration: 3, time: 0 },
  { reqId: 2, position: 3, duration: 4, time: 2 },
  { reqId: 3, position: 18, duration: 2, time: 4 },
  { reqId: 4, position: 7, duration: 5, time: 5 },
];

let waitingQueue = [];
let currentTime = 0;
let totalRides = 0;

// === Fonctions utilitaires ===

// Trouver le taxi disponible le plus proche
function findNearestAvailableTaxi(position) {
  let availableTaxis = taxis.filter(t => t.available);
  if (availableTaxis.length === 0) return null;
  let nearest = availableTaxis.reduce((prev, curr) => {
    let prevDist = Math.abs(prev.position - position);
    let currDist = Math.abs(curr.position - position);
    return currDist < prevDist ? curr : prev;
  });
  return nearest;
}

// Assigner une demande à un taxi
function assignRequestToTaxi(request, taxi) {
  const distance = Math.abs(taxi.position - request.position);
  console.log(
    `→ Request ${request.reqId} at position ${request.position} → Taxi ${taxi.id} assigned (distance: ${distance})`
  );

  taxi.available = false;
  taxi.timeRemaining = request.duration;
  taxi.totalRides++;
  taxi.position = request.position; // Le taxi se déplace vers le client (destination finale)
  totalRides++;
}

// Met à jour le temps restant pour chaque taxi
function updateTaxis() {
  taxis.forEach(taxi => {
    if (!taxi.available && taxi.timeRemaining > 0) {
      taxi.timeRemaining--;
      if (taxi.timeRemaining === 0) {
        taxi.available = true;
        console.log(`→ Taxi ${taxi.id} finished ride and is now available.`);
        // Si des demandes attendent, prendre la première
        if (waitingQueue.length > 0) {
          let nextRequest = waitingQueue.shift();
          console.log(
            `→ Taxi ${taxi.id} takes Request ${nextRequest.reqId} from queue.`
          );
          assignRequestToTaxi(nextRequest, taxi);
        }
      }
    }
  });
}

// === Boucle principale de simulation ===
console.log("=== Smart Taxi Dispatcher Simulation ===");

let allRequestsHandled = false;

while (!allRequestsHandled) {
  console.log(`\nMinute ${currentTime}:`);

  // 1. Vérifier les nouvelles demandes qui arrivent à ce moment
  let newRequests = requests.filter(r => r.time === currentTime);
  newRequests.forEach(request => {
    let taxi = findNearestAvailableTaxi(request.position);
    if (taxi) {
      assignRequestToTaxi(request, taxi);
    } else {
      console.log(
        `→ Request ${request.reqId} at position ${request.position} → all taxis busy → added to queue.`
      );
      waitingQueue.push(request);
    }
  });

  // 2. Mettre à jour les taxis (décrémentation du temps restant)
  updateTaxis();

  // 3. Vérifier si la simulation peut s'arrêter
  const allRequestsProcessed =
    totalRides === requests.length && waitingQueue.length === 0;
  const allTaxisFree = taxis.every(t => t.available);

  if (allRequestsProcessed && allTaxisFree) {
    allRequestsHandled = true;
  } else {
    currentTime++;
  }
}

// === Rapport final ===
console.log("\n--- Final Report ---");
taxis.forEach(taxi => {
  console.log(
    `Taxi ${taxi.id}: ${taxi.totalRides} rides, final position ${taxi.position}`
  );
});
console.log(`Total rides: ${totalRides}`);
console.log(`Total simulated time: ${currentTime} minutes`);

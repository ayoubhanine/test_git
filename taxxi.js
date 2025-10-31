let taxis = [
  { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
  { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 },
];
let requests = [
  /*{ reqId: 1, position: 10, duration: 3, time: 0 },
  { reqId: 2, position: 10, duration: 3, time: 0 },
  { reqId: 3, position: 10, duration: 3, time: 0 },
  { reqId: 4, position: 10, duration: 3, time: 0 },*/
  {reqId: 1, position: 10, duration: 3, time: 0 },
  { reqId: 2, position: 3, duration: 4, time: 2 },
  { reqId: 3, position: 18, duration: 2, time: 4 },
  { reqId: 4, position: 7, duration: 5, time: 5 },
  { reqId: 5, position: 117, duration: 11, time: 7 },
  
];
function findNearestAvailableTaxi(position) {
  let availableTaxis = taxis.filter(t => t.available);
  if (availableTaxis.length === 0) return null;
  let neareqst = availableTaxis.reduce((prev, curr) => {
    let prevDist = Math.abs(prev.position - position);
    let currDist = Math.abs(curr.position - position);
    return currDist < prevDist ? curr : prev;
  });
  return neareqst;
}
let totalRides = 0;
function assignRequestToTaxi(request, taxi) {
  const distance = Math.abs(taxi.position - request.position);
  console.log(
    " la demande", request.reqId, "en position", request.position,"Taxi",taxi.id, "assignee la distance:" ,distance)
  ;

  taxi.available = false;
  taxi.timeRemaining = request.duration;
  taxi.totalRides++;
  taxi.position = request.position; 
  totalRides++;
}
let waitingQueue = [];

function updateTaxis() {
  for (let i = 0; i < taxis.length; i++) {
    let taxi = taxis[i];
    if (taxi.available==false && taxi.timeRemaining > 0) {
      taxi.timeRemaining--;
      if (taxi.timeRemaining === 0) {
        taxi.available = true;
        console.log(`Taxi ${taxi.id} a terminé sa course et est maintenant disponible.`);
        if (waitingQueue.length > 0) {
          let nextRequest = waitingQueue.shift();
          console.log(
            `Taxi ${taxi.id} prend la commande ${nextRequest.reqId} d'après la liste d'attente.`
          );
          assignRequestToTaxi(nextRequest, taxi);
        }
      }
    }
  }
}

console.log("=== Smart Taxi Dispatcher Simulation ===");

let allRequestsHandled = false;
let comptTime = 0;
while (!allRequestsHandled) {
  console.log(`\nMinute ${comptTime}:`);
  let newRequests = requests.filter(r => r.time === comptTime);
  newRequests.forEach(request => {
    let taxi = findNearestAvailableTaxi(request.position);
    if (taxi) {
      assignRequestToTaxi(request, taxi);
    } else {
      console.log(
        ` la demmande ${request.reqId} en position ${request.position} ,les taxi sont ocuupes → cette commande va etre ajouter a la liste dattente.`
      );
      waitingQueue.push(request);
    }
  });
  updateTaxis();

  const allRequests =
    totalRides === requests.length && waitingQueue.length === 0;
  const allTaxisFree = taxis.every(t => t.available);

  if (allRequests && allTaxisFree) {
    allRequestsHandled = true;
  } else {
    comptTime++;
  }
}
console.log("\n--- Final Report ---");
taxis.forEach(taxi => {
  console.log(
    `Taxi ${taxi.id}: ${taxi.totalRides} rides, final position ${taxi.position}`
  );
});
console.log(`Total rides: ${totalRides}`);
console.log(`Total simulated time: ${comptTime} minutes`);

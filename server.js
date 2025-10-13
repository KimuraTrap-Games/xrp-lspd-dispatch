const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public')); // your HTML, CSS, JS in 'public' folder

// Keep track of current calls and units
let calls = [];
let units = [];

io.on('connection', (socket) => {
  // Send current state to new user
  socket.emit('init', { calls, units });

  // Add unit
  socket.on('addUnit', unit => {
    units.push(unit);
    io.emit('unitAdded', unit);
  });

  // Remove unit
  socket.on('removeUnit', callsign => {
    units = units.filter(u => u.callsign !== callsign);
    io.emit('unitRemoved', callsign);
  });

  // Add call
  socket.on('addCall', call => {
    calls.push(call);
    io.emit('callAdded', call);
  });

  // Delete call
  socket.on('deleteCall', id => {
    calls = calls.filter(c => c.id !== id);
    io.emit('callDeleted', id);
  });

  // Assign unit
  socket.on('assignUnit', data => {
    const call = calls.find(c => c.id === data.callId);
    if (!call) return;
    if (!call.assignedUnits) call.assignedUnits = [];
    call.assignedUnits.push(data.unit);
    io.emit('unitAssigned', data);
  });

  // Unassign unit
  socket.on('unassignUnit', data => {
    const call = calls.find(c => c.id === data.callId);
    if (!call || !call.assignedUnits) return;
    call.assignedUnits = call.assignedUnits.filter(u => u !== data.unit);
    io.emit('unitUnassigned', data);
  });
});

http.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

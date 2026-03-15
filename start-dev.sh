#!/bin/bash
echo "Starting Cortex IDE..."

# Start backend
echo "Starting Java backend..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend
sleep 5

# Start frontend dev server
echo "Starting Angular frontend..."
cd frontend
npx ng serve --open &
FRONTEND_PID=$!
cd ..

echo ""
echo "Cortex IDE running:"
echo "  Frontend: http://localhost:4200"
echo "  Backend:  http://localhost:8081"
echo ""
echo "Press Ctrl+C to stop"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait

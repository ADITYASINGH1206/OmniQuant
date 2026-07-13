from fastapi import FastAPI
from backtester import EventDrivenBacktester, BacktestRequest
import uvicorn

app = FastAPI(title="Quant Engine Microservice")

@app.post("/engine/backtest")
async def run_backtest(request: BacktestRequest):
    print(f"[FastAPI] Running backtest with {len(request.data)} bars...")
    backtester = EventDrivenBacktester(request)
    results = backtester.run()
    return {
        "status": "success",
        "results": results
    }

@app.get("/engine/ping")
async def ping_engine():
    print("[FastAPI] Received ping from API Gateway")
    return {
        "status": "success", 
        "message": "Python Engine is alive!"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

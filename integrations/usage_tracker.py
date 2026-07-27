import time
import logging
from typing import Any, Dict, List, Optional
from functools import wraps
from datetime import datetime

logger = logging.getLogger(__name__)

class UsageRecord:
    def __init__(self, service: str, method: str, params: dict, result: dict, duration_ms: float, success: bool):
        self.service = service
        self.method = method
        self.params = params
        self.result = result
        self.duration_ms = duration_ms
        self.success = success
        self.timestamp = datetime.utcnow().isoformat() + "Z"

    def to_dict(self) -> Dict:
        return {
            "service": self.service,
            "method": self.method,
            "params": self.params,
            "result": self.result,
            "duration_ms": round(self.duration_ms, 2),
            "success": self.success,
            "timestamp": self.timestamp,
        }


class UsageTracker:
    def __init__(self):
        self._records: List[UsageRecord] = []
        self._summary: Dict[str, Any] = {}
        self._init_summary()

    def _init_summary(self):
        self._summary = {
            "total_calls": 0,
            "successful_calls": 0,
            "failed_calls": 0,
            "total_duration_ms": 0.0,
            "by_service": {},
        }

    def record(self, record: UsageRecord):
        self._records.append(record)
        self._update_summary(record)

    def _update_summary(self, record: UsageRecord):
        self._summary["total_calls"] += 1
        self._summary["total_duration_ms"] += record.duration_ms
        if record.success:
            self._summary["successful_calls"] += 1
        else:
            self._summary["failed_calls"] += 1

        svc = record.service
        if svc not in self._summary["by_service"]:
            self._summary["by_service"][svc] = {
                "calls": 0,
                "successful": 0,
                "failed": 0,
                "duration_ms": 0.0,
                "methods": {},
            }
        s = self._summary["by_service"][svc]
        s["calls"] += 1
        s["duration_ms"] += record.duration_ms
        if record.success:
            s["successful"] += 1
        else:
            s["failed"] += 1

        meth = record.method
        if meth not in s["methods"]:
            s["methods"][meth] = {"calls": 0, "successful": 0, "failed": 0, "duration_ms": 0.0}
        m = s["methods"][meth]
        m["calls"] += 1
        m["duration_ms"] += record.duration_ms
        if record.success:
            m["successful"] += 1
        else:
            m["failed"] += 1

    def get_records(self, limit: int = 100, service: Optional[str] = None) -> List[Dict]:
        records = self._records
        if service:
            records = [r for r in records if r.service == service]
        return [r.to_dict() for r in records[-limit:]]

    def get_summary(self) -> Dict:
        s = dict(self._summary)
        avg = s["total_duration_ms"] / s["total_calls"] if s["total_calls"] else 0.0
        s["average_duration_ms"] = round(avg, 2)
        for svc in s["by_service"]:
            svc_data = s["by_service"][svc]
            svc_data["duration_ms"] = round(svc_data["duration_ms"], 2)
            for meth in svc_data["methods"]:
                svc_data["methods"][meth]["duration_ms"] = round(
                    svc_data["methods"][meth]["duration_ms"], 2
                )
        return s

    def clear(self):
        self._records.clear()
        self._init_summary()


tracker = UsageTracker()


def track(service: str):
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                result = await func(*args, **kwargs)
                duration = (time.perf_counter() - start) * 1000
                safe_params = _safe_params(service, func.__name__, args, kwargs)
                tracker.record(UsageRecord(
                    service=service,
                    method=func.__name__,
                    params=safe_params,
                    result=_safe_result(result),
                    duration_ms=duration,
                    success=True,
                ))
                return result
            except Exception as e:
                duration = (time.perf_counter() - start) * 1000
                safe_params = _safe_params(service, func.__name__, args, kwargs)
                tracker.record(UsageRecord(
                    service=service,
                    method=func.__name__,
                    params=safe_params,
                    result={"error": str(e)},
                    duration_ms=duration,
                    success=False,
                ))
                raise

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                result = func(*args, **kwargs)
                duration = (time.perf_counter() - start) * 1000
                safe_params = _safe_params(service, func.__name__, args, kwargs)
                tracker.record(UsageRecord(
                    service=service,
                    method=func.__name__,
                    params=safe_params,
                    result=_safe_result(result),
                    duration_ms=duration,
                    success=True,
                ))
                return result
            except Exception as e:
                duration = (time.perf_counter() - start) * 1000
                safe_params = _safe_params(service, func.__name__, args, kwargs)
                tracker.record(UsageRecord(
                    service=service,
                    method=func.__name__,
                    params=safe_params,
                    result={"error": str(e)},
                    duration_ms=duration,
                    success=False,
                ))
                raise

        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        return sync_wrapper

    return decorator


def _safe_params(service: str, method: str, args: tuple, kwargs: dict) -> dict:
    safe: dict = {}
    arg_names = _get_arg_names(service, method)
    for i, arg in enumerate(args):
        key = arg_names[i] if i < len(arg_names) else f"arg_{i}"
        safe[key] = _truncate(arg)
    for k, v in kwargs.items():
        safe[k] = _truncate(v)
    return safe


def _safe_result(result: Any) -> dict:
    if isinstance(result, dict):
        safe = {}
        for k, v in result.items():
            safe[k] = _truncate(v)
        return safe
    return {"result": _truncate(result)}


def _truncate(value: Any, max_len: int = 100) -> Any:
    s = str(value)
    if len(s) > max_len:
        return s[:max_len] + "..."
    if isinstance(value, (int, float, bool)):
        return value
    return s


_CALL_ARGS: Dict[str, list] = {
    "ArcConnector": ["self"],
    "NanopaymentsManager": ["self"],
    "AgentStackManager": ["self"],
    "CircleAppKits": ["self"],
    "Contracts": ["self"],
}


def _get_arg_names(service: str, method: str) -> list:
    import inspect
    try:
        path_map = {
            "ArcConnector": ("integrations.arc_connector", "ArcConnector"),
            "NanopaymentsManager": ("integrations.nanopayments", "NanopaymentsManager"),
            "AgentStackManager": ("integrations.agent_stack", "AgentStackManager"),
            "CircleAppKits": ("integrations.app_kits", "CircleAppKits"),
            "Contracts": ("integrations.contracts", None),
        }
        if service in path_map:
            mod_path, cls_name = path_map[service]
            mod = __import__(mod_path, fromlist=[cls_name] if cls_name else [])
            cls = getattr(mod, cls_name) if cls_name else mod
            meth = getattr(cls, method, None)
            if meth:
                sig = inspect.signature(meth)
                return [p.name for p in sig.parameters.values()][1:]
    except Exception:
        pass
    return []

from typing import Dict, List
from app.models.schemas import DigitalTwinState, Alert, SOSSnapshot

class InMemoryStore:
    def __init__(self):
        # Maps rider_id -> DigitalTwinState
        self.digital_twins: Dict[str, DigitalTwinState] = {}
        # Maps rider_id -> List[Alert]
        self.alerts: Dict[str, List[Alert]] = {}
        # Maps rider_id -> List[SOSSnapshot]
        self.sos_snapshots: Dict[str, List[SOSSnapshot]] = {}

    def update_twin(self, rider_id: str, state: DigitalTwinState):
        self.digital_twins[rider_id] = state

    def get_twin(self, rider_id: str) -> DigitalTwinState:
        return self.digital_twins.get(rider_id)

    def get_all_twins(self) -> List[DigitalTwinState]:
        return list(self.digital_twins.values())

    def add_alert(self, rider_id: str, alert: Alert):
        if rider_id not in self.alerts:
            self.alerts[rider_id] = []
        self.alerts[rider_id].append(alert)

    def get_alerts(self, rider_id: str) -> List[Alert]:
        return self.alerts.get(rider_id, [])

    def get_all_alerts(self) -> List[Alert]:
        all_alerts = []
        for r_alerts in self.alerts.values():
            all_alerts.extend(r_alerts)
        return all_alerts

    def add_sos(self, rider_id: str, sos: SOSSnapshot):
        if rider_id not in self.sos_snapshots:
            self.sos_snapshots[rider_id] = []
        self.sos_snapshots[rider_id].append(sos)

    def get_sos(self, rider_id: str) -> List[SOSSnapshot]:
        return self.sos_snapshots.get(rider_id, [])

# Singleton instance for the application
store = InMemoryStore()

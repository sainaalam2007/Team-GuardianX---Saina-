import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(const GuardianXApp());
}

class GuardianXApp extends StatelessWidget {
  const GuardianXApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GuardianX',
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Colors.indigo,
        colorScheme: ColorScheme.dark(
          primary: Colors.indigoAccent,
          secondary: Colors.tealAccent,
        ),
        useMaterial3: true,
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final String riderId = "rider_123";
  final String backendUrl = "http://10.0.2.2:8000/api"; // Android emulator localhost
  
  Map<String, dynamic>? twinState;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchTwinState();
  }

  Future<void> fetchTwinState() async {
    try {
      final response = await http.get(Uri.parse('$backendUrl/twins/$riderId'));
      if (response.statusCode == 200) {
        setState(() {
          twinState = json.decode(response.body);
          isLoading = false;
        });
      }
    } catch (e) {
      print("Error fetching twin state: $e");
    }
  }

  void triggerSOS() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('SOS TRIGGERED! Dispatching emergency contacts...'),
        backgroundColor: Colors.redAccent,
        duration: Duration(seconds: 3),
      )
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('GuardianX Rider'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() => isLoading = true);
              fetchTwinState();
            },
          )
        ],
      ),
      body: isLoading 
        ? const Center(child: CircularProgressIndicator())
        : twinState == null
          ? const Center(child: Text("Waiting for helmet connection..."))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _buildHealthCard(),
                  const SizedBox(height: 16),
                  _buildAlertsCard(),
                  const Spacer(),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    onPressed: triggerSOS,
                    child: const Text('EMERGENCY SOS', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  )
                ],
              ),
            ),
    );
  }

  Widget _buildHealthCard() {
    final status = twinState!['health_status'];
    Color statusColor = Colors.green;
    if (status == 'warning') statusColor = Colors.orange;
    if (status == 'critical') statusColor = Colors.red;

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Text("Rider Status", style: TextStyle(fontSize: 18, color: Colors.grey)),
            const SizedBox(height: 8),
            Text(status.toString().toUpperCase(), style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: statusColor)),
            const Divider(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildMetric("Speed", "${twinState!['current_speed'].toStringAsFixed(1)} km/h"),
                _buildMetric("Fatigue", "${(twinState!['fatigue_score'] * 100).toInt()}%"),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(String label, String value) {
    return Column(
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w500)),
      ],
    );
  }
  
  Widget _buildAlertsCard() {
    List<dynamic> alerts = twinState!['active_alerts'] ?? [];
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Recent Alerts", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            alerts.isEmpty 
              ? const Text("No active alerts", style: TextStyle(color: Colors.grey))
              : Column(
                  children: alerts.map((a) => ListTile(
                    leading: const Icon(Icons.warning, color: Colors.orange),
                    title: const Text("System Alert"),
                    subtitle: Text(a.toString()),
                  )).toList(),
                )
          ],
        ),
      ),
    );
  }
}

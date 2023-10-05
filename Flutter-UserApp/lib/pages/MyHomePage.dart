import 'package:firebase_database/firebase_database.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fyp/providers.dart';

class MyHomePage extends ConsumerWidget {
  const MyHomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // if (ref.read(userProvider).value == null)
    //   Navigator.pushReplacementNamed(context, "/login");
    return Scaffold(
      appBar: AppBar(actions: [
        IconButton(
          icon: const Icon(Icons.logout_outlined),
          tooltip: 'Logout',
          onPressed: () async {
            ref.read(firebaseAuthProvider).signOut();
          },
        ),
      ]),
      body: Column(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: ref.watch(snapshotProvider).map(
                data: (data) {
                  List<Widget> retval = [];
                  DataTable dataTable = DataTable(
                    columns: const [
                      DataColumn(label: Text("Org Name")),
                      DataColumn(label: Text("Document ID")),
                      DataColumn(label: Text("Permission")),
                    ],
                    rows: [],
                  );
                  data.maybeWhen(
                    data: (data) {
                      for (var element in data) {
                        dataTable.rows.add(
                          DataRow(
                            cells: [
                              DataCell(Text(element.item1)),
                              DataCell(Text(element.item2)),
                              DataCell(
                                Switch(
                                  onChanged: (value) {
                                    final aadharNumber = ref
                                        .read(aadharProvider)
                                        .value
                                        .toString();
                                    DatabaseReference reference =
                                        FirebaseDatabase.instance
                                            .ref(aadharNumber)
                                            .child(element.item1)
                                            .child(element.item2);
                                    reference.set(!element.item3);
                                  },
                                  value: element.item3,
                                ),
                              )
                            ],
                          ),
                        );
                      }
                    },
                    orElse: () => [],
                  );
                  retval.add(dataTable);
                  return retval;
                },
                error: (err) => [],
                loading: (load) => []),
          )
        ],
      ),
    );
  }
}

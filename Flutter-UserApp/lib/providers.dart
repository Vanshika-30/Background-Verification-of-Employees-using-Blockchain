import 'package:flutter/cupertino.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:tuple/tuple.dart';
import 'package:firebase_auth/firebase_auth.dart';

enum UiState { Login, Signup }

FirebaseDatabase database = FirebaseDatabase.instance;
FirebaseAuth fireBaseAuth = FirebaseAuth.instance;
final firebaseAuthProvider =
    Provider<FirebaseAuth>((ref) => FirebaseAuth.instance);

final firebaseDatabaseProvider =
    Provider<FirebaseDatabase>((ref) => FirebaseDatabase.instance);

final userProvider =
    StreamProvider((ref) => FirebaseAuth.instance.authStateChanges());

final uiStateProvider = StateProvider<UiState>((ref) => UiState.Login);
final controllerProvider =
    Provider((ref) => TextEditingController(text: "1234"));

final aadharProvider = StreamProvider((pref) {
  final user = pref.watch(userProvider).value;
  DatabaseReference ref = FirebaseDatabase.instance.ref("users/" + user!.uid);
  final refValue = ref.onValue;
  return refValue.map((event) {
    for (var doc in event.snapshot.children) {
      final docname = doc.key;
      final value = doc.value;
      if (docname == "aadhar") return value;
    }
  });
});

final snapshotProvider =
    StreamProvider<List<Tuple3<String, String, bool>>>((pref) {
  final aadharNumber = pref.watch(aadharProvider);
  DatabaseReference ref =
      FirebaseDatabase.instance.ref(aadharNumber.value.toString());
  final refValue = ref.onValue;
  return refValue.map((event) {
    final result = <Tuple3<String, String, bool>>[];
    for (var org in event.snapshot.children) {
      final orgname = org.key;
      for (var doc in org.children) {
        final docname = doc.key;
        final value = doc.value as bool;
        result.add(Tuple3(orgname!, docname!, value));
      }
    }
    return result;
  });
});

final debugger = Provider((ref) {
  final snapshot = ref.watch(snapshotProvider);
});

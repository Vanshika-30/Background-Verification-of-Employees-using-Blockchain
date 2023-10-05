import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fyp/pages/LoginPage.dart';
import 'package:fyp/pages/SignUpPage.dart';
import 'package:fyp/providers.dart';

class AuthenticationPage extends ConsumerWidget {
  const AuthenticationPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(uiStateProvider);
    return state == UiState.Login ? const LoginPage() : SignUpPage();
  }
}

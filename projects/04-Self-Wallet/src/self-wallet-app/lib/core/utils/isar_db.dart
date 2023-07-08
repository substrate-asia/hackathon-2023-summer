import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sunrise/app/data/models/account_colletction.dart';

class IsarDb {
  Isar? isar;

  Future<Isar> init() async {
    final dir = await getApplicationDocumentsDirectory();
    final isar = await Isar.open(
      [BalanceSchema, MainnetSchema, ContractSchema, ProxyAccountSchema],
      directory: dir.path,
    );
    this.isar = isar;
    return isar;
  }
}

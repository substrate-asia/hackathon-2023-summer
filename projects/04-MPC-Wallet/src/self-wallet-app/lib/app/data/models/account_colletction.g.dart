// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_colletction.dart';

// **************************************************************************
// IsarCollectionGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types

extension GetBalanceCollection on Isar {
  IsarCollection<Balance> get balances => this.collection();
}

const BalanceSchema = CollectionSchema(
  name: r'Balance',
  id: 1067837778200036490,
  properties: {
    r'address': PropertySchema(
      id: 0,
      name: r'address',
      type: IsarType.string,
    ),
    r'balance': PropertySchema(
      id: 1,
      name: r'balance',
      type: IsarType.string,
    ),
    r'chainId': PropertySchema(
      id: 2,
      name: r'chainId',
      type: IsarType.long,
    ),
    r'contract': PropertySchema(
      id: 3,
      name: r'contract',
      type: IsarType.object,
      target: r'ContractEnum',
    ),
    r'contractAddress': PropertySchema(
      id: 4,
      name: r'contractAddress',
      type: IsarType.string,
    ),
    r'explorer': PropertySchema(
      id: 5,
      name: r'explorer',
      type: IsarType.string,
    ),
    r'iconUrl': PropertySchema(
      id: 6,
      name: r'iconUrl',
      type: IsarType.string,
    ),
    r'isContract': PropertySchema(
      id: 7,
      name: r'isContract',
      type: IsarType.bool,
    ),
    r'isProxy': PropertySchema(
      id: 8,
      name: r'isProxy',
      type: IsarType.bool,
    ),
    r'nativeSymbol': PropertySchema(
      id: 9,
      name: r'nativeSymbol',
      type: IsarType.string,
    ),
    r'networkName': PropertySchema(
      id: 10,
      name: r'networkName',
      type: IsarType.string,
    ),
    r'tokenDecimals': PropertySchema(
      id: 11,
      name: r'tokenDecimals',
      type: IsarType.long,
    ),
    r'tokenIconUrl': PropertySchema(
      id: 12,
      name: r'tokenIconUrl',
      type: IsarType.string,
    ),
    r'tokenName': PropertySchema(
      id: 13,
      name: r'tokenName',
      type: IsarType.string,
    ),
    r'tokenSymbol': PropertySchema(
      id: 14,
      name: r'tokenSymbol',
      type: IsarType.string,
    )
  },
  estimateSize: _balanceEstimateSize,
  serialize: _balanceSerialize,
  deserialize: _balanceDeserialize,
  deserializeProp: _balanceDeserializeProp,
  idName: r'id',
  indexes: {},
  links: {
    r'network': LinkSchema(
      id: 7987985310624214162,
      name: r'network',
      target: r'Mainnet',
      single: true,
    )
  },
  embeddedSchemas: {r'ContractEnum': ContractEnumSchema},
  getId: _balanceGetId,
  getLinks: _balanceGetLinks,
  attach: _balanceAttach,
  version: '3.1.0+1',
);

int _balanceEstimateSize(
  Balance object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.address.length * 3;
  bytesCount += 3 + object.balance.length * 3;
  {
    final value = object.contract;
    if (value != null) {
      bytesCount += 3 +
          ContractEnumSchema.estimateSize(
              value, allOffsets[ContractEnum]!, allOffsets);
    }
  }
  {
    final value = object.contractAddress;
    if (value != null) {
      bytesCount += 3 + value.length * 3;
    }
  }
  bytesCount += 3 + object.explorer.length * 3;
  bytesCount += 3 + object.iconUrl.length * 3;
  bytesCount += 3 + object.nativeSymbol.length * 3;
  bytesCount += 3 + object.networkName.length * 3;
  bytesCount += 3 + object.tokenIconUrl.length * 3;
  bytesCount += 3 + object.tokenName.length * 3;
  bytesCount += 3 + object.tokenSymbol.length * 3;
  return bytesCount;
}

void _balanceSerialize(
  Balance object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeString(offsets[0], object.address);
  writer.writeString(offsets[1], object.balance);
  writer.writeLong(offsets[2], object.chainId);
  writer.writeObject<ContractEnum>(
    offsets[3],
    allOffsets,
    ContractEnumSchema.serialize,
    object.contract,
  );
  writer.writeString(offsets[4], object.contractAddress);
  writer.writeString(offsets[5], object.explorer);
  writer.writeString(offsets[6], object.iconUrl);
  writer.writeBool(offsets[7], object.isContract);
  writer.writeBool(offsets[8], object.isProxy);
  writer.writeString(offsets[9], object.nativeSymbol);
  writer.writeString(offsets[10], object.networkName);
  writer.writeLong(offsets[11], object.tokenDecimals);
  writer.writeString(offsets[12], object.tokenIconUrl);
  writer.writeString(offsets[13], object.tokenName);
  writer.writeString(offsets[14], object.tokenSymbol);
}

Balance _balanceDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = Balance(
    address: reader.readString(offsets[0]),
    balance: reader.readStringOrNull(offsets[1]) ?? "0",
    chainId: reader.readLong(offsets[2]),
    contract: reader.readObjectOrNull<ContractEnum>(
      offsets[3],
      ContractEnumSchema.deserialize,
      allOffsets,
    ),
    contractAddress: reader.readStringOrNull(offsets[4]),
    isContract: reader.readBoolOrNull(offsets[7]) ?? false,
    isProxy: reader.readBoolOrNull(offsets[8]) ?? false,
  );
  object.id = id;
  return object;
}

P _balanceDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readString(offset)) as P;
    case 1:
      return (reader.readStringOrNull(offset) ?? "0") as P;
    case 2:
      return (reader.readLong(offset)) as P;
    case 3:
      return (reader.readObjectOrNull<ContractEnum>(
        offset,
        ContractEnumSchema.deserialize,
        allOffsets,
      )) as P;
    case 4:
      return (reader.readStringOrNull(offset)) as P;
    case 5:
      return (reader.readString(offset)) as P;
    case 6:
      return (reader.readString(offset)) as P;
    case 7:
      return (reader.readBoolOrNull(offset) ?? false) as P;
    case 8:
      return (reader.readBoolOrNull(offset) ?? false) as P;
    case 9:
      return (reader.readString(offset)) as P;
    case 10:
      return (reader.readString(offset)) as P;
    case 11:
      return (reader.readLongOrNull(offset)) as P;
    case 12:
      return (reader.readString(offset)) as P;
    case 13:
      return (reader.readString(offset)) as P;
    case 14:
      return (reader.readString(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _balanceGetId(Balance object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _balanceGetLinks(Balance object) {
  return [object.network];
}

void _balanceAttach(IsarCollection<dynamic> col, Id id, Balance object) {
  object.id = id;
  object.network.attach(col, col.isar.collection<Mainnet>(), r'network', id);
}

extension BalanceQueryWhereSort on QueryBuilder<Balance, Balance, QWhere> {
  QueryBuilder<Balance, Balance, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension BalanceQueryWhere on QueryBuilder<Balance, Balance, QWhereClause> {
  QueryBuilder<Balance, Balance, QAfterWhereClause> idEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterWhereClause> idNotEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<Balance, Balance, QAfterWhereClause> idGreaterThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<Balance, Balance, QAfterWhereClause> idLessThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<Balance, Balance, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: lowerId,
        includeLower: includeLower,
        upper: upperId,
        includeUpper: includeUpper,
      ));
    });
  }
}

extension BalanceQueryFilter
    on QueryBuilder<Balance, Balance, QFilterCondition> {
  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'address',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'address',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'address',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> addressIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'address',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'balance',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'balance',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'balance',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'balance',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'balance',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'balance',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'balance',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'balance',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'balance',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> balanceIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'balance',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> chainIdEqualTo(
      int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> chainIdGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> chainIdLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> chainIdBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'chainId',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> contractIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNull(
        property: r'contract',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> contractIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNotNull(
        property: r'contract',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      contractAddressIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNull(
        property: r'contractAddress',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      contractAddressIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNotNull(
        property: r'contractAddress',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> contractAddressEqualTo(
    String? value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      contractAddressGreaterThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> contractAddressLessThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> contractAddressBetween(
    String? lower,
    String? upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'contractAddress',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      contractAddressStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> contractAddressEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> contractAddressContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> contractAddressMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'contractAddress',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      contractAddressIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'contractAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      contractAddressIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'contractAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'explorer',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'explorer',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'explorer',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> explorerIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'explorer',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'iconUrl',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'iconUrl',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'iconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> iconUrlIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'iconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> idEqualTo(Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'id',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> isContractEqualTo(
      bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'isContract',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> isProxyEqualTo(
      bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'isProxy',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'nativeSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'nativeSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'nativeSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'nativeSymbol',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'nativeSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'nativeSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'nativeSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'nativeSymbol',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> nativeSymbolIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'nativeSymbol',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      nativeSymbolIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'nativeSymbol',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'networkName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'networkName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'networkName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'networkName',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'networkName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'networkName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'networkName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'networkName',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'networkName',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      networkNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'networkName',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenDecimalsIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNull(
        property: r'tokenDecimals',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      tokenDecimalsIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNotNull(
        property: r'tokenDecimals',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenDecimalsEqualTo(
      int? value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'tokenDecimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      tokenDecimalsGreaterThan(
    int? value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'tokenDecimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenDecimalsLessThan(
    int? value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'tokenDecimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenDecimalsBetween(
    int? lower,
    int? upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'tokenDecimals',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'tokenIconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'tokenIconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'tokenIconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'tokenIconUrl',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'tokenIconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'tokenIconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'tokenIconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'tokenIconUrl',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenIconUrlIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'tokenIconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      tokenIconUrlIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'tokenIconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'tokenName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'tokenName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'tokenName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'tokenName',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'tokenName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'tokenName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'tokenName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'tokenName',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'tokenName',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'tokenName',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'tokenSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'tokenSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'tokenSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'tokenSymbol',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'tokenSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'tokenSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'tokenSymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'tokenSymbol',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> tokenSymbolIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'tokenSymbol',
        value: '',
      ));
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition>
      tokenSymbolIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'tokenSymbol',
        value: '',
      ));
    });
  }
}

extension BalanceQueryObject
    on QueryBuilder<Balance, Balance, QFilterCondition> {
  QueryBuilder<Balance, Balance, QAfterFilterCondition> contract(
      FilterQuery<ContractEnum> q) {
    return QueryBuilder.apply(this, (query) {
      return query.object(q, r'contract');
    });
  }
}

extension BalanceQueryLinks
    on QueryBuilder<Balance, Balance, QFilterCondition> {
  QueryBuilder<Balance, Balance, QAfterFilterCondition> network(
      FilterQuery<Mainnet> q) {
    return QueryBuilder.apply(this, (query) {
      return query.link(q, r'network');
    });
  }

  QueryBuilder<Balance, Balance, QAfterFilterCondition> networkIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.linkLength(r'network', 0, true, 0, true);
    });
  }
}

extension BalanceQuerySortBy on QueryBuilder<Balance, Balance, QSortBy> {
  QueryBuilder<Balance, Balance, QAfterSortBy> sortByAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'address', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'address', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByBalance() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'balance', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByBalanceDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'balance', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByChainIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByContractAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'contractAddress', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByContractAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'contractAddress', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByExplorer() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'explorer', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByExplorerDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'explorer', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByIconUrl() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByIconUrlDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByIsContract() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isContract', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByIsContractDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isContract', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByIsProxy() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isProxy', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByIsProxyDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isProxy', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByNativeSymbol() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeSymbol', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByNativeSymbolDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeSymbol', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByNetworkName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'networkName', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByNetworkNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'networkName', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByTokenDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenDecimals', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByTokenDecimalsDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenDecimals', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByTokenIconUrl() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenIconUrl', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByTokenIconUrlDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenIconUrl', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByTokenName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenName', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByTokenNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenName', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByTokenSymbol() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenSymbol', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> sortByTokenSymbolDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenSymbol', Sort.desc);
    });
  }
}

extension BalanceQuerySortThenBy
    on QueryBuilder<Balance, Balance, QSortThenBy> {
  QueryBuilder<Balance, Balance, QAfterSortBy> thenByAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'address', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'address', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByBalance() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'balance', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByBalanceDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'balance', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByChainIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByContractAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'contractAddress', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByContractAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'contractAddress', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByExplorer() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'explorer', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByExplorerDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'explorer', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByIconUrl() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByIconUrlDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByIsContract() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isContract', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByIsContractDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isContract', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByIsProxy() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isProxy', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByIsProxyDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isProxy', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByNativeSymbol() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeSymbol', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByNativeSymbolDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeSymbol', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByNetworkName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'networkName', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByNetworkNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'networkName', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByTokenDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenDecimals', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByTokenDecimalsDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenDecimals', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByTokenIconUrl() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenIconUrl', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByTokenIconUrlDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenIconUrl', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByTokenName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenName', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByTokenNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenName', Sort.desc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByTokenSymbol() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenSymbol', Sort.asc);
    });
  }

  QueryBuilder<Balance, Balance, QAfterSortBy> thenByTokenSymbolDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'tokenSymbol', Sort.desc);
    });
  }
}

extension BalanceQueryWhereDistinct
    on QueryBuilder<Balance, Balance, QDistinct> {
  QueryBuilder<Balance, Balance, QDistinct> distinctByAddress(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'address', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByBalance(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'balance', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'chainId');
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByContractAddress(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'contractAddress',
          caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByExplorer(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'explorer', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByIconUrl(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'iconUrl', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByIsContract() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'isContract');
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByIsProxy() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'isProxy');
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByNativeSymbol(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'nativeSymbol', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByNetworkName(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'networkName', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByTokenDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'tokenDecimals');
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByTokenIconUrl(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'tokenIconUrl', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByTokenName(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'tokenName', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Balance, Balance, QDistinct> distinctByTokenSymbol(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'tokenSymbol', caseSensitive: caseSensitive);
    });
  }
}

extension BalanceQueryProperty
    on QueryBuilder<Balance, Balance, QQueryProperty> {
  QueryBuilder<Balance, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> addressProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'address');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> balanceProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'balance');
    });
  }

  QueryBuilder<Balance, int, QQueryOperations> chainIdProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'chainId');
    });
  }

  QueryBuilder<Balance, ContractEnum?, QQueryOperations> contractProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'contract');
    });
  }

  QueryBuilder<Balance, String?, QQueryOperations> contractAddressProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'contractAddress');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> explorerProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'explorer');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> iconUrlProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'iconUrl');
    });
  }

  QueryBuilder<Balance, bool, QQueryOperations> isContractProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'isContract');
    });
  }

  QueryBuilder<Balance, bool, QQueryOperations> isProxyProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'isProxy');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> nativeSymbolProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'nativeSymbol');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> networkNameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'networkName');
    });
  }

  QueryBuilder<Balance, int?, QQueryOperations> tokenDecimalsProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'tokenDecimals');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> tokenIconUrlProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'tokenIconUrl');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> tokenNameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'tokenName');
    });
  }

  QueryBuilder<Balance, String, QQueryOperations> tokenSymbolProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'tokenSymbol');
    });
  }
}

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types

extension GetMainnetCollection on Isar {
  IsarCollection<Mainnet> get mainnets => this.collection();
}

const MainnetSchema = CollectionSchema(
  name: r'Mainnet',
  id: 4357539262975545859,
  properties: {
    r'chainColor': PropertySchema(
      id: 0,
      name: r'chainColor',
      type: IsarType.string,
    ),
    r'chainId': PropertySchema(
      id: 1,
      name: r'chainId',
      type: IsarType.long,
    ),
    r'chainName': PropertySchema(
      id: 2,
      name: r'chainName',
      type: IsarType.string,
    ),
    r'enabled': PropertySchema(
      id: 3,
      name: r'enabled',
      type: IsarType.bool,
    ),
    r'explorer': PropertySchema(
      id: 4,
      name: r'explorer',
      type: IsarType.string,
    ),
    r'iconUrl': PropertySchema(
      id: 5,
      name: r'iconUrl',
      type: IsarType.string,
    ),
    r'isTestnet': PropertySchema(
      id: 6,
      name: r'isTestnet',
      type: IsarType.bool,
    ),
    r'nativeCurrencyDecimals': PropertySchema(
      id: 7,
      name: r'nativeCurrencyDecimals',
      type: IsarType.long,
    ),
    r'nativeCurrencyName': PropertySchema(
      id: 8,
      name: r'nativeCurrencyName',
      type: IsarType.string,
    ),
    r'nativeCurrencySymbol': PropertySchema(
      id: 9,
      name: r'nativeCurrencySymbol',
      type: IsarType.string,
    ),
    r'rpc': PropertySchema(
      id: 10,
      name: r'rpc',
      type: IsarType.string,
    ),
    r'shortName': PropertySchema(
      id: 11,
      name: r'shortName',
      type: IsarType.string,
    ),
    r'ws': PropertySchema(
      id: 12,
      name: r'ws',
      type: IsarType.string,
    )
  },
  estimateSize: _mainnetEstimateSize,
  serialize: _mainnetSerialize,
  deserialize: _mainnetDeserialize,
  deserializeProp: _mainnetDeserializeProp,
  idName: r'id',
  indexes: {
    r'chainId': IndexSchema(
      id: -1458695854461403261,
      name: r'chainId',
      unique: true,
      replace: false,
      properties: [
        IndexPropertySchema(
          name: r'chainId',
          type: IndexType.value,
          caseSensitive: false,
        )
      ],
    )
  },
  links: {},
  embeddedSchemas: {},
  getId: _mainnetGetId,
  getLinks: _mainnetGetLinks,
  attach: _mainnetAttach,
  version: '3.1.0+1',
);

int _mainnetEstimateSize(
  Mainnet object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.chainColor.length * 3;
  bytesCount += 3 + object.chainName.length * 3;
  bytesCount += 3 + object.explorer.length * 3;
  bytesCount += 3 + object.iconUrl.length * 3;
  bytesCount += 3 + object.nativeCurrencyName.length * 3;
  bytesCount += 3 + object.nativeCurrencySymbol.length * 3;
  bytesCount += 3 + object.rpc.length * 3;
  bytesCount += 3 + object.shortName.length * 3;
  {
    final value = object.ws;
    if (value != null) {
      bytesCount += 3 + value.length * 3;
    }
  }
  return bytesCount;
}

void _mainnetSerialize(
  Mainnet object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeString(offsets[0], object.chainColor);
  writer.writeLong(offsets[1], object.chainId);
  writer.writeString(offsets[2], object.chainName);
  writer.writeBool(offsets[3], object.enabled);
  writer.writeString(offsets[4], object.explorer);
  writer.writeString(offsets[5], object.iconUrl);
  writer.writeBool(offsets[6], object.isTestnet);
  writer.writeLong(offsets[7], object.nativeCurrencyDecimals);
  writer.writeString(offsets[8], object.nativeCurrencyName);
  writer.writeString(offsets[9], object.nativeCurrencySymbol);
  writer.writeString(offsets[10], object.rpc);
  writer.writeString(offsets[11], object.shortName);
  writer.writeString(offsets[12], object.ws);
}

Mainnet _mainnetDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = Mainnet(
    chainColor: reader.readString(offsets[0]),
    chainId: reader.readLong(offsets[1]),
    chainName: reader.readString(offsets[2]),
    enabled: reader.readBoolOrNull(offsets[3]) ?? true,
    explorer: reader.readString(offsets[4]),
    iconUrl: reader.readString(offsets[5]),
    isTestnet: reader.readBoolOrNull(offsets[6]) ?? false,
    nativeCurrencyDecimals: reader.readLong(offsets[7]),
    nativeCurrencyName: reader.readString(offsets[8]),
    nativeCurrencySymbol: reader.readString(offsets[9]),
    rpc: reader.readString(offsets[10]),
    shortName: reader.readString(offsets[11]),
    ws: reader.readStringOrNull(offsets[12]),
  );
  object.id = id;
  return object;
}

P _mainnetDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readString(offset)) as P;
    case 1:
      return (reader.readLong(offset)) as P;
    case 2:
      return (reader.readString(offset)) as P;
    case 3:
      return (reader.readBoolOrNull(offset) ?? true) as P;
    case 4:
      return (reader.readString(offset)) as P;
    case 5:
      return (reader.readString(offset)) as P;
    case 6:
      return (reader.readBoolOrNull(offset) ?? false) as P;
    case 7:
      return (reader.readLong(offset)) as P;
    case 8:
      return (reader.readString(offset)) as P;
    case 9:
      return (reader.readString(offset)) as P;
    case 10:
      return (reader.readString(offset)) as P;
    case 11:
      return (reader.readString(offset)) as P;
    case 12:
      return (reader.readStringOrNull(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _mainnetGetId(Mainnet object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _mainnetGetLinks(Mainnet object) {
  return [];
}

void _mainnetAttach(IsarCollection<dynamic> col, Id id, Mainnet object) {
  object.id = id;
}

extension MainnetByIndex on IsarCollection<Mainnet> {
  Future<Mainnet?> getByChainId(int chainId) {
    return getByIndex(r'chainId', [chainId]);
  }

  Mainnet? getByChainIdSync(int chainId) {
    return getByIndexSync(r'chainId', [chainId]);
  }

  Future<bool> deleteByChainId(int chainId) {
    return deleteByIndex(r'chainId', [chainId]);
  }

  bool deleteByChainIdSync(int chainId) {
    return deleteByIndexSync(r'chainId', [chainId]);
  }

  Future<List<Mainnet?>> getAllByChainId(List<int> chainIdValues) {
    final values = chainIdValues.map((e) => [e]).toList();
    return getAllByIndex(r'chainId', values);
  }

  List<Mainnet?> getAllByChainIdSync(List<int> chainIdValues) {
    final values = chainIdValues.map((e) => [e]).toList();
    return getAllByIndexSync(r'chainId', values);
  }

  Future<int> deleteAllByChainId(List<int> chainIdValues) {
    final values = chainIdValues.map((e) => [e]).toList();
    return deleteAllByIndex(r'chainId', values);
  }

  int deleteAllByChainIdSync(List<int> chainIdValues) {
    final values = chainIdValues.map((e) => [e]).toList();
    return deleteAllByIndexSync(r'chainId', values);
  }

  Future<Id> putByChainId(Mainnet object) {
    return putByIndex(r'chainId', object);
  }

  Id putByChainIdSync(Mainnet object, {bool saveLinks = true}) {
    return putByIndexSync(r'chainId', object, saveLinks: saveLinks);
  }

  Future<List<Id>> putAllByChainId(List<Mainnet> objects) {
    return putAllByIndex(r'chainId', objects);
  }

  List<Id> putAllByChainIdSync(List<Mainnet> objects, {bool saveLinks = true}) {
    return putAllByIndexSync(r'chainId', objects, saveLinks: saveLinks);
  }
}

extension MainnetQueryWhereSort on QueryBuilder<Mainnet, Mainnet, QWhere> {
  QueryBuilder<Mainnet, Mainnet, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhere> anyChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        const IndexWhereClause.any(indexName: r'chainId'),
      );
    });
  }
}

extension MainnetQueryWhere on QueryBuilder<Mainnet, Mainnet, QWhereClause> {
  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> idEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> idNotEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> idGreaterThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> idLessThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: lowerId,
        includeLower: includeLower,
        upper: upperId,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> chainIdEqualTo(
      int chainId) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.equalTo(
        indexName: r'chainId',
        value: [chainId],
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> chainIdNotEqualTo(
      int chainId) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId',
              lower: [],
              upper: [chainId],
              includeUpper: false,
            ))
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId',
              lower: [chainId],
              includeLower: false,
              upper: [],
            ));
      } else {
        return query
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId',
              lower: [chainId],
              includeLower: false,
              upper: [],
            ))
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId',
              lower: [],
              upper: [chainId],
              includeUpper: false,
            ));
      }
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> chainIdGreaterThan(
    int chainId, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.between(
        indexName: r'chainId',
        lower: [chainId],
        includeLower: include,
        upper: [],
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> chainIdLessThan(
    int chainId, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.between(
        indexName: r'chainId',
        lower: [],
        upper: [chainId],
        includeUpper: include,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterWhereClause> chainIdBetween(
    int lowerChainId,
    int upperChainId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.between(
        indexName: r'chainId',
        lower: [lowerChainId],
        includeLower: includeLower,
        upper: [upperChainId],
        includeUpper: includeUpper,
      ));
    });
  }
}

extension MainnetQueryFilter
    on QueryBuilder<Mainnet, Mainnet, QFilterCondition> {
  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'chainColor',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'chainColor',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'chainColor',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'chainColor',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'chainColor',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'chainColor',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'chainColor',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'chainColor',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'chainColor',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainColorIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'chainColor',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainIdEqualTo(
      int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainIdGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainIdLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainIdBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'chainId',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'chainName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'chainName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'chainName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'chainName',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'chainName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'chainName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'chainName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'chainName',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'chainName',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> chainNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'chainName',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> enabledEqualTo(
      bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'enabled',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'explorer',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'explorer',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'explorer',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'explorer',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> explorerIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'explorer',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'iconUrl',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'iconUrl',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'iconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> iconUrlIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'iconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> idEqualTo(Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'id',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> isTestnetEqualTo(
      bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'isTestnet',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyDecimalsEqualTo(int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'nativeCurrencyDecimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyDecimalsGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'nativeCurrencyDecimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyDecimalsLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'nativeCurrencyDecimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyDecimalsBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'nativeCurrencyDecimals',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'nativeCurrencyName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'nativeCurrencyName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'nativeCurrencyName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'nativeCurrencyName',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'nativeCurrencyName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'nativeCurrencyName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'nativeCurrencyName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'nativeCurrencyName',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'nativeCurrencyName',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencyNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'nativeCurrencyName',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'nativeCurrencySymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'nativeCurrencySymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'nativeCurrencySymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'nativeCurrencySymbol',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'nativeCurrencySymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'nativeCurrencySymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'nativeCurrencySymbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'nativeCurrencySymbol',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'nativeCurrencySymbol',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition>
      nativeCurrencySymbolIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'nativeCurrencySymbol',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'rpc',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'rpc',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'rpc',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'rpc',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'rpc',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'rpc',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'rpc',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'rpc',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'rpc',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> rpcIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'rpc',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'shortName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'shortName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'shortName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'shortName',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'shortName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'shortName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'shortName',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'shortName',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'shortName',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> shortNameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'shortName',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsIsNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNull(
        property: r'ws',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsIsNotNull() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(const FilterCondition.isNotNull(
        property: r'ws',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsEqualTo(
    String? value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'ws',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsGreaterThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'ws',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsLessThan(
    String? value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'ws',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsBetween(
    String? lower,
    String? upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'ws',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'ws',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'ws',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsContains(String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'ws',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'ws',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'ws',
        value: '',
      ));
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterFilterCondition> wsIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'ws',
        value: '',
      ));
    });
  }
}

extension MainnetQueryObject
    on QueryBuilder<Mainnet, Mainnet, QFilterCondition> {}

extension MainnetQueryLinks
    on QueryBuilder<Mainnet, Mainnet, QFilterCondition> {}

extension MainnetQuerySortBy on QueryBuilder<Mainnet, Mainnet, QSortBy> {
  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByChainColor() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainColor', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByChainColorDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainColor', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByChainIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByChainName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainName', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByChainNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainName', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByEnabledDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByExplorer() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'explorer', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByExplorerDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'explorer', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByIconUrl() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByIconUrlDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByIsTestnet() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isTestnet', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByIsTestnetDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isTestnet', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByNativeCurrencyDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencyDecimals', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy>
      sortByNativeCurrencyDecimalsDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencyDecimals', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByNativeCurrencyName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencyName', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByNativeCurrencyNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencyName', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByNativeCurrencySymbol() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencySymbol', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy>
      sortByNativeCurrencySymbolDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencySymbol', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByRpc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'rpc', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByRpcDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'rpc', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByShortName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'shortName', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByShortNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'shortName', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByWs() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'ws', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> sortByWsDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'ws', Sort.desc);
    });
  }
}

extension MainnetQuerySortThenBy
    on QueryBuilder<Mainnet, Mainnet, QSortThenBy> {
  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByChainColor() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainColor', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByChainColorDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainColor', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByChainIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByChainName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainName', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByChainNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainName', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByEnabledDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByExplorer() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'explorer', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByExplorerDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'explorer', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByIconUrl() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByIconUrlDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByIsTestnet() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isTestnet', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByIsTestnetDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'isTestnet', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByNativeCurrencyDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencyDecimals', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy>
      thenByNativeCurrencyDecimalsDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencyDecimals', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByNativeCurrencyName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencyName', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByNativeCurrencyNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencyName', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByNativeCurrencySymbol() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencySymbol', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy>
      thenByNativeCurrencySymbolDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'nativeCurrencySymbol', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByRpc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'rpc', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByRpcDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'rpc', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByShortName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'shortName', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByShortNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'shortName', Sort.desc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByWs() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'ws', Sort.asc);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QAfterSortBy> thenByWsDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'ws', Sort.desc);
    });
  }
}

extension MainnetQueryWhereDistinct
    on QueryBuilder<Mainnet, Mainnet, QDistinct> {
  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByChainColor(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'chainColor', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'chainId');
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByChainName(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'chainName', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'enabled');
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByExplorer(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'explorer', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByIconUrl(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'iconUrl', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByIsTestnet() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'isTestnet');
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByNativeCurrencyDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'nativeCurrencyDecimals');
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByNativeCurrencyName(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'nativeCurrencyName',
          caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByNativeCurrencySymbol(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'nativeCurrencySymbol',
          caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByRpc(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'rpc', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByShortName(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'shortName', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Mainnet, Mainnet, QDistinct> distinctByWs(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'ws', caseSensitive: caseSensitive);
    });
  }
}

extension MainnetQueryProperty
    on QueryBuilder<Mainnet, Mainnet, QQueryProperty> {
  QueryBuilder<Mainnet, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<Mainnet, String, QQueryOperations> chainColorProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'chainColor');
    });
  }

  QueryBuilder<Mainnet, int, QQueryOperations> chainIdProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'chainId');
    });
  }

  QueryBuilder<Mainnet, String, QQueryOperations> chainNameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'chainName');
    });
  }

  QueryBuilder<Mainnet, bool, QQueryOperations> enabledProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'enabled');
    });
  }

  QueryBuilder<Mainnet, String, QQueryOperations> explorerProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'explorer');
    });
  }

  QueryBuilder<Mainnet, String, QQueryOperations> iconUrlProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'iconUrl');
    });
  }

  QueryBuilder<Mainnet, bool, QQueryOperations> isTestnetProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'isTestnet');
    });
  }

  QueryBuilder<Mainnet, int, QQueryOperations>
      nativeCurrencyDecimalsProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'nativeCurrencyDecimals');
    });
  }

  QueryBuilder<Mainnet, String, QQueryOperations> nativeCurrencyNameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'nativeCurrencyName');
    });
  }

  QueryBuilder<Mainnet, String, QQueryOperations>
      nativeCurrencySymbolProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'nativeCurrencySymbol');
    });
  }

  QueryBuilder<Mainnet, String, QQueryOperations> rpcProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'rpc');
    });
  }

  QueryBuilder<Mainnet, String, QQueryOperations> shortNameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'shortName');
    });
  }

  QueryBuilder<Mainnet, String?, QQueryOperations> wsProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'ws');
    });
  }
}

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types

extension GetContractCollection on Isar {
  IsarCollection<Contract> get contracts => this.collection();
}

const ContractSchema = CollectionSchema(
  name: r'Contract',
  id: 6075293080182411034,
  properties: {
    r'chainId': PropertySchema(
      id: 0,
      name: r'chainId',
      type: IsarType.long,
    ),
    r'contractAddress': PropertySchema(
      id: 1,
      name: r'contractAddress',
      type: IsarType.string,
    ),
    r'decimals': PropertySchema(
      id: 2,
      name: r'decimals',
      type: IsarType.long,
    ),
    r'enabled': PropertySchema(
      id: 3,
      name: r'enabled',
      type: IsarType.bool,
    ),
    r'iconUrl': PropertySchema(
      id: 4,
      name: r'iconUrl',
      type: IsarType.string,
    ),
    r'name': PropertySchema(
      id: 5,
      name: r'name',
      type: IsarType.string,
    ),
    r'proxy': PropertySchema(
      id: 6,
      name: r'proxy',
      type: IsarType.bool,
    ),
    r'symbol': PropertySchema(
      id: 7,
      name: r'symbol',
      type: IsarType.string,
    )
  },
  estimateSize: _contractEstimateSize,
  serialize: _contractSerialize,
  deserialize: _contractDeserialize,
  deserializeProp: _contractDeserializeProp,
  idName: r'id',
  indexes: {
    r'chainId_contractAddress': IndexSchema(
      id: -5232407182466119669,
      name: r'chainId_contractAddress',
      unique: false,
      replace: false,
      properties: [
        IndexPropertySchema(
          name: r'chainId',
          type: IndexType.value,
          caseSensitive: false,
        ),
        IndexPropertySchema(
          name: r'contractAddress',
          type: IndexType.hash,
          caseSensitive: true,
        )
      ],
    )
  },
  links: {},
  embeddedSchemas: {},
  getId: _contractGetId,
  getLinks: _contractGetLinks,
  attach: _contractAttach,
  version: '3.1.0+1',
);

int _contractEstimateSize(
  Contract object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.contractAddress.length * 3;
  bytesCount += 3 + object.iconUrl.length * 3;
  bytesCount += 3 + object.name.length * 3;
  bytesCount += 3 + object.symbol.length * 3;
  return bytesCount;
}

void _contractSerialize(
  Contract object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeLong(offsets[0], object.chainId);
  writer.writeString(offsets[1], object.contractAddress);
  writer.writeLong(offsets[2], object.decimals);
  writer.writeBool(offsets[3], object.enabled);
  writer.writeString(offsets[4], object.iconUrl);
  writer.writeString(offsets[5], object.name);
  writer.writeBool(offsets[6], object.proxy);
  writer.writeString(offsets[7], object.symbol);
}

Contract _contractDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = Contract(
    chainId: reader.readLong(offsets[0]),
    contractAddress: reader.readString(offsets[1]),
    decimals: reader.readLong(offsets[2]),
    enabled: reader.readBoolOrNull(offsets[3]) ?? true,
    iconUrl: reader.readString(offsets[4]),
    name: reader.readString(offsets[5]),
    proxy: reader.readBoolOrNull(offsets[6]) ?? false,
    symbol: reader.readString(offsets[7]),
  );
  object.id = id;
  return object;
}

P _contractDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readLong(offset)) as P;
    case 1:
      return (reader.readString(offset)) as P;
    case 2:
      return (reader.readLong(offset)) as P;
    case 3:
      return (reader.readBoolOrNull(offset) ?? true) as P;
    case 4:
      return (reader.readString(offset)) as P;
    case 5:
      return (reader.readString(offset)) as P;
    case 6:
      return (reader.readBoolOrNull(offset) ?? false) as P;
    case 7:
      return (reader.readString(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _contractGetId(Contract object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _contractGetLinks(Contract object) {
  return [];
}

void _contractAttach(IsarCollection<dynamic> col, Id id, Contract object) {
  object.id = id;
}

extension ContractQueryWhereSort on QueryBuilder<Contract, Contract, QWhere> {
  QueryBuilder<Contract, Contract, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension ContractQueryWhere on QueryBuilder<Contract, Contract, QWhereClause> {
  QueryBuilder<Contract, Contract, QAfterWhereClause> idEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause> idNotEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause> idGreaterThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause> idLessThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: lowerId,
        includeLower: includeLower,
        upper: upperId,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause>
      chainIdEqualToAnyContractAddress(int chainId) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.equalTo(
        indexName: r'chainId_contractAddress',
        value: [chainId],
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause>
      chainIdNotEqualToAnyContractAddress(int chainId) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId_contractAddress',
              lower: [],
              upper: [chainId],
              includeUpper: false,
            ))
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId_contractAddress',
              lower: [chainId],
              includeLower: false,
              upper: [],
            ));
      } else {
        return query
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId_contractAddress',
              lower: [chainId],
              includeLower: false,
              upper: [],
            ))
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId_contractAddress',
              lower: [],
              upper: [chainId],
              includeUpper: false,
            ));
      }
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause>
      chainIdGreaterThanAnyContractAddress(
    int chainId, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.between(
        indexName: r'chainId_contractAddress',
        lower: [chainId],
        includeLower: include,
        upper: [],
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause>
      chainIdLessThanAnyContractAddress(
    int chainId, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.between(
        indexName: r'chainId_contractAddress',
        lower: [],
        upper: [chainId],
        includeUpper: include,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause>
      chainIdBetweenAnyContractAddress(
    int lowerChainId,
    int upperChainId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.between(
        indexName: r'chainId_contractAddress',
        lower: [lowerChainId],
        includeLower: includeLower,
        upper: [upperChainId],
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause>
      chainIdContractAddressEqualTo(int chainId, String contractAddress) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IndexWhereClause.equalTo(
        indexName: r'chainId_contractAddress',
        value: [chainId, contractAddress],
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterWhereClause>
      chainIdEqualToContractAddressNotEqualTo(
          int chainId, String contractAddress) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId_contractAddress',
              lower: [chainId],
              upper: [chainId, contractAddress],
              includeUpper: false,
            ))
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId_contractAddress',
              lower: [chainId, contractAddress],
              includeLower: false,
              upper: [chainId],
            ));
      } else {
        return query
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId_contractAddress',
              lower: [chainId, contractAddress],
              includeLower: false,
              upper: [chainId],
            ))
            .addWhereClause(IndexWhereClause.between(
              indexName: r'chainId_contractAddress',
              lower: [chainId],
              upper: [chainId, contractAddress],
              includeUpper: false,
            ));
      }
    });
  }
}

extension ContractQueryFilter
    on QueryBuilder<Contract, Contract, QFilterCondition> {
  QueryBuilder<Contract, Contract, QAfterFilterCondition> chainIdEqualTo(
      int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> chainIdGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> chainIdLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> chainIdBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'chainId',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'contractAddress',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'contractAddress',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'contractAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition>
      contractAddressIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'contractAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> decimalsEqualTo(
      int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'decimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> decimalsGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'decimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> decimalsLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'decimals',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> decimalsBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'decimals',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> enabledEqualTo(
      bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'enabled',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'iconUrl',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'iconUrl',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'iconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> iconUrlIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'iconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> idEqualTo(Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'id',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'name',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'name',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'name',
        value: '',
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> nameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'name',
        value: '',
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> proxyEqualTo(
      bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'proxy',
        value: value,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'symbol',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'symbol',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'symbol',
        value: '',
      ));
    });
  }

  QueryBuilder<Contract, Contract, QAfterFilterCondition> symbolIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'symbol',
        value: '',
      ));
    });
  }
}

extension ContractQueryObject
    on QueryBuilder<Contract, Contract, QFilterCondition> {}

extension ContractQueryLinks
    on QueryBuilder<Contract, Contract, QFilterCondition> {}

extension ContractQuerySortBy on QueryBuilder<Contract, Contract, QSortBy> {
  QueryBuilder<Contract, Contract, QAfterSortBy> sortByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByChainIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByContractAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'contractAddress', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByContractAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'contractAddress', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'decimals', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByDecimalsDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'decimals', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByEnabledDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByIconUrl() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByIconUrlDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'name', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'name', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByProxy() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'proxy', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortByProxyDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'proxy', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortBySymbol() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'symbol', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> sortBySymbolDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'symbol', Sort.desc);
    });
  }
}

extension ContractQuerySortThenBy
    on QueryBuilder<Contract, Contract, QSortThenBy> {
  QueryBuilder<Contract, Contract, QAfterSortBy> thenByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByChainIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'chainId', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByContractAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'contractAddress', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByContractAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'contractAddress', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'decimals', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByDecimalsDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'decimals', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByEnabledDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByIconUrl() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByIconUrlDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'iconUrl', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByName() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'name', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByNameDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'name', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByProxy() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'proxy', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenByProxyDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'proxy', Sort.desc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenBySymbol() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'symbol', Sort.asc);
    });
  }

  QueryBuilder<Contract, Contract, QAfterSortBy> thenBySymbolDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'symbol', Sort.desc);
    });
  }
}

extension ContractQueryWhereDistinct
    on QueryBuilder<Contract, Contract, QDistinct> {
  QueryBuilder<Contract, Contract, QDistinct> distinctByChainId() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'chainId');
    });
  }

  QueryBuilder<Contract, Contract, QDistinct> distinctByContractAddress(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'contractAddress',
          caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Contract, Contract, QDistinct> distinctByDecimals() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'decimals');
    });
  }

  QueryBuilder<Contract, Contract, QDistinct> distinctByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'enabled');
    });
  }

  QueryBuilder<Contract, Contract, QDistinct> distinctByIconUrl(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'iconUrl', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Contract, Contract, QDistinct> distinctByName(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'name', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<Contract, Contract, QDistinct> distinctByProxy() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'proxy');
    });
  }

  QueryBuilder<Contract, Contract, QDistinct> distinctBySymbol(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'symbol', caseSensitive: caseSensitive);
    });
  }
}

extension ContractQueryProperty
    on QueryBuilder<Contract, Contract, QQueryProperty> {
  QueryBuilder<Contract, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<Contract, int, QQueryOperations> chainIdProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'chainId');
    });
  }

  QueryBuilder<Contract, String, QQueryOperations> contractAddressProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'contractAddress');
    });
  }

  QueryBuilder<Contract, int, QQueryOperations> decimalsProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'decimals');
    });
  }

  QueryBuilder<Contract, bool, QQueryOperations> enabledProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'enabled');
    });
  }

  QueryBuilder<Contract, String, QQueryOperations> iconUrlProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'iconUrl');
    });
  }

  QueryBuilder<Contract, String, QQueryOperations> nameProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'name');
    });
  }

  QueryBuilder<Contract, bool, QQueryOperations> proxyProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'proxy');
    });
  }

  QueryBuilder<Contract, String, QQueryOperations> symbolProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'symbol');
    });
  }
}

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types

extension GetProxyAccountCollection on Isar {
  IsarCollection<ProxyAccount> get proxyAccounts => this.collection();
}

const ProxyAccountSchema = CollectionSchema(
  name: r'ProxyAccount',
  id: 8780844269471237887,
  properties: {
    r'address': PropertySchema(
      id: 0,
      name: r'address',
      type: IsarType.string,
    ),
    r'enabled': PropertySchema(
      id: 1,
      name: r'enabled',
      type: IsarType.bool,
    ),
    r'entryPointAddress': PropertySchema(
      id: 2,
      name: r'entryPointAddress',
      type: IsarType.string,
    ),
    r'rootAddress': PropertySchema(
      id: 3,
      name: r'rootAddress',
      type: IsarType.string,
    )
  },
  estimateSize: _proxyAccountEstimateSize,
  serialize: _proxyAccountSerialize,
  deserialize: _proxyAccountDeserialize,
  deserializeProp: _proxyAccountDeserializeProp,
  idName: r'id',
  indexes: {},
  links: {},
  embeddedSchemas: {},
  getId: _proxyAccountGetId,
  getLinks: _proxyAccountGetLinks,
  attach: _proxyAccountAttach,
  version: '3.1.0+1',
);

int _proxyAccountEstimateSize(
  ProxyAccount object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.address.length * 3;
  bytesCount += 3 + object.entryPointAddress.length * 3;
  bytesCount += 3 + object.rootAddress.length * 3;
  return bytesCount;
}

void _proxyAccountSerialize(
  ProxyAccount object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeString(offsets[0], object.address);
  writer.writeBool(offsets[1], object.enabled);
  writer.writeString(offsets[2], object.entryPointAddress);
  writer.writeString(offsets[3], object.rootAddress);
}

ProxyAccount _proxyAccountDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = ProxyAccount(
    address: reader.readString(offsets[0]),
    enabled: reader.readBoolOrNull(offsets[1]) ?? true,
    entryPointAddress: reader.readString(offsets[2]),
    rootAddress: reader.readString(offsets[3]),
  );
  object.id = id;
  return object;
}

P _proxyAccountDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readString(offset)) as P;
    case 1:
      return (reader.readBoolOrNull(offset) ?? true) as P;
    case 2:
      return (reader.readString(offset)) as P;
    case 3:
      return (reader.readString(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

Id _proxyAccountGetId(ProxyAccount object) {
  return object.id;
}

List<IsarLinkBase<dynamic>> _proxyAccountGetLinks(ProxyAccount object) {
  return [];
}

void _proxyAccountAttach(
    IsarCollection<dynamic> col, Id id, ProxyAccount object) {
  object.id = id;
}

extension ProxyAccountQueryWhereSort
    on QueryBuilder<ProxyAccount, ProxyAccount, QWhere> {
  QueryBuilder<ProxyAccount, ProxyAccount, QAfterWhere> anyId() {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(const IdWhereClause.any());
    });
  }
}

extension ProxyAccountQueryWhere
    on QueryBuilder<ProxyAccount, ProxyAccount, QWhereClause> {
  QueryBuilder<ProxyAccount, ProxyAccount, QAfterWhereClause> idEqualTo(Id id) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: id,
        upper: id,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterWhereClause> idNotEqualTo(
      Id id) {
    return QueryBuilder.apply(this, (query) {
      if (query.whereSort == Sort.asc) {
        return query
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            )
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            );
      } else {
        return query
            .addWhereClause(
              IdWhereClause.greaterThan(lower: id, includeLower: false),
            )
            .addWhereClause(
              IdWhereClause.lessThan(upper: id, includeUpper: false),
            );
      }
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterWhereClause> idGreaterThan(
      Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.greaterThan(lower: id, includeLower: include),
      );
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterWhereClause> idLessThan(Id id,
      {bool include = false}) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(
        IdWhereClause.lessThan(upper: id, includeUpper: include),
      );
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterWhereClause> idBetween(
    Id lowerId,
    Id upperId, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addWhereClause(IdWhereClause.between(
        lower: lowerId,
        includeLower: includeLower,
        upper: upperId,
        includeUpper: includeUpper,
      ));
    });
  }
}

extension ProxyAccountQueryFilter
    on QueryBuilder<ProxyAccount, ProxyAccount, QFilterCondition> {
  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'address',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'address',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'address',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'address',
        value: '',
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      addressIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'address',
        value: '',
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      enabledEqualTo(bool value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'enabled',
        value: value,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'entryPointAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'entryPointAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'entryPointAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'entryPointAddress',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'entryPointAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'entryPointAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'entryPointAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'entryPointAddress',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'entryPointAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      entryPointAddressIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'entryPointAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition> idEqualTo(
      Id value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition> idGreaterThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition> idLessThan(
    Id value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'id',
        value: value,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition> idBetween(
    Id lower,
    Id upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'id',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'rootAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'rootAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'rootAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'rootAddress',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'rootAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'rootAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'rootAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'rootAddress',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'rootAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterFilterCondition>
      rootAddressIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'rootAddress',
        value: '',
      ));
    });
  }
}

extension ProxyAccountQueryObject
    on QueryBuilder<ProxyAccount, ProxyAccount, QFilterCondition> {}

extension ProxyAccountQueryLinks
    on QueryBuilder<ProxyAccount, ProxyAccount, QFilterCondition> {}

extension ProxyAccountQuerySortBy
    on QueryBuilder<ProxyAccount, ProxyAccount, QSortBy> {
  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> sortByAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'address', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> sortByAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'address', Sort.desc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> sortByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> sortByEnabledDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.desc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy>
      sortByEntryPointAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'entryPointAddress', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy>
      sortByEntryPointAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'entryPointAddress', Sort.desc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> sortByRootAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'rootAddress', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy>
      sortByRootAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'rootAddress', Sort.desc);
    });
  }
}

extension ProxyAccountQuerySortThenBy
    on QueryBuilder<ProxyAccount, ProxyAccount, QSortThenBy> {
  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> thenByAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'address', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> thenByAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'address', Sort.desc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> thenByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> thenByEnabledDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'enabled', Sort.desc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy>
      thenByEntryPointAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'entryPointAddress', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy>
      thenByEntryPointAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'entryPointAddress', Sort.desc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> thenById() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> thenByIdDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'id', Sort.desc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy> thenByRootAddress() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'rootAddress', Sort.asc);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QAfterSortBy>
      thenByRootAddressDesc() {
    return QueryBuilder.apply(this, (query) {
      return query.addSortBy(r'rootAddress', Sort.desc);
    });
  }
}

extension ProxyAccountQueryWhereDistinct
    on QueryBuilder<ProxyAccount, ProxyAccount, QDistinct> {
  QueryBuilder<ProxyAccount, ProxyAccount, QDistinct> distinctByAddress(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'address', caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QDistinct> distinctByEnabled() {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'enabled');
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QDistinct>
      distinctByEntryPointAddress({bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'entryPointAddress',
          caseSensitive: caseSensitive);
    });
  }

  QueryBuilder<ProxyAccount, ProxyAccount, QDistinct> distinctByRootAddress(
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addDistinctBy(r'rootAddress', caseSensitive: caseSensitive);
    });
  }
}

extension ProxyAccountQueryProperty
    on QueryBuilder<ProxyAccount, ProxyAccount, QQueryProperty> {
  QueryBuilder<ProxyAccount, int, QQueryOperations> idProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'id');
    });
  }

  QueryBuilder<ProxyAccount, String, QQueryOperations> addressProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'address');
    });
  }

  QueryBuilder<ProxyAccount, bool, QQueryOperations> enabledProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'enabled');
    });
  }

  QueryBuilder<ProxyAccount, String, QQueryOperations>
      entryPointAddressProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'entryPointAddress');
    });
  }

  QueryBuilder<ProxyAccount, String, QQueryOperations> rootAddressProperty() {
    return QueryBuilder.apply(this, (query) {
      return query.addPropertyName(r'rootAddress');
    });
  }
}

// **************************************************************************
// IsarEmbeddedGenerator
// **************************************************************************

// coverage:ignore-file
// ignore_for_file: duplicate_ignore, non_constant_identifier_names, constant_identifier_names, invalid_use_of_protected_member, unnecessary_cast, prefer_const_constructors, lines_longer_than_80_chars, require_trailing_commas, inference_failure_on_function_invocation, unnecessary_parenthesis, unnecessary_raw_strings, unnecessary_null_checks, join_return_with_assignment, prefer_final_locals, avoid_js_rounded_ints, avoid_positional_boolean_parameters, always_specify_types

const ContractEnumSchema = Schema(
  name: r'ContractEnum',
  id: 6759219591240110484,
  properties: {
    r'chainId': PropertySchema(
      id: 0,
      name: r'chainId',
      type: IsarType.long,
    ),
    r'contractAddress': PropertySchema(
      id: 1,
      name: r'contractAddress',
      type: IsarType.string,
    ),
    r'decimals': PropertySchema(
      id: 2,
      name: r'decimals',
      type: IsarType.long,
    ),
    r'iconUrl': PropertySchema(
      id: 3,
      name: r'iconUrl',
      type: IsarType.string,
    ),
    r'name': PropertySchema(
      id: 4,
      name: r'name',
      type: IsarType.string,
    ),
    r'symbol': PropertySchema(
      id: 5,
      name: r'symbol',
      type: IsarType.string,
    )
  },
  estimateSize: _contractEnumEstimateSize,
  serialize: _contractEnumSerialize,
  deserialize: _contractEnumDeserialize,
  deserializeProp: _contractEnumDeserializeProp,
);

int _contractEnumEstimateSize(
  ContractEnum object,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  var bytesCount = offsets.last;
  bytesCount += 3 + object.contractAddress.length * 3;
  bytesCount += 3 + object.iconUrl.length * 3;
  bytesCount += 3 + object.name.length * 3;
  bytesCount += 3 + object.symbol.length * 3;
  return bytesCount;
}

void _contractEnumSerialize(
  ContractEnum object,
  IsarWriter writer,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  writer.writeLong(offsets[0], object.chainId);
  writer.writeString(offsets[1], object.contractAddress);
  writer.writeLong(offsets[2], object.decimals);
  writer.writeString(offsets[3], object.iconUrl);
  writer.writeString(offsets[4], object.name);
  writer.writeString(offsets[5], object.symbol);
}

ContractEnum _contractEnumDeserialize(
  Id id,
  IsarReader reader,
  List<int> offsets,
  Map<Type, List<int>> allOffsets,
) {
  final object = ContractEnum();
  object.chainId = reader.readLong(offsets[0]);
  object.contractAddress = reader.readString(offsets[1]);
  object.decimals = reader.readLong(offsets[2]);
  object.iconUrl = reader.readString(offsets[3]);
  object.name = reader.readString(offsets[4]);
  object.symbol = reader.readString(offsets[5]);
  return object;
}

P _contractEnumDeserializeProp<P>(
  IsarReader reader,
  int propertyId,
  int offset,
  Map<Type, List<int>> allOffsets,
) {
  switch (propertyId) {
    case 0:
      return (reader.readLong(offset)) as P;
    case 1:
      return (reader.readString(offset)) as P;
    case 2:
      return (reader.readLong(offset)) as P;
    case 3:
      return (reader.readString(offset)) as P;
    case 4:
      return (reader.readString(offset)) as P;
    case 5:
      return (reader.readString(offset)) as P;
    default:
      throw IsarError('Unknown property with id $propertyId');
  }
}

extension ContractEnumQueryFilter
    on QueryBuilder<ContractEnum, ContractEnum, QFilterCondition> {
  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      chainIdEqualTo(int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      chainIdGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      chainIdLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'chainId',
        value: value,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      chainIdBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'chainId',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'contractAddress',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'contractAddress',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'contractAddress',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'contractAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      contractAddressIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'contractAddress',
        value: '',
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      decimalsEqualTo(int value) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'decimals',
        value: value,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      decimalsGreaterThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'decimals',
        value: value,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      decimalsLessThan(
    int value, {
    bool include = false,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'decimals',
        value: value,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      decimalsBetween(
    int lower,
    int upper, {
    bool includeLower = true,
    bool includeUpper = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'decimals',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'iconUrl',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'iconUrl',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlMatches(String pattern, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'iconUrl',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'iconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      iconUrlIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'iconUrl',
        value: '',
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> nameEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      nameGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> nameLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> nameBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'name',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      nameStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> nameEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> nameContains(
      String value,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'name',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> nameMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'name',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      nameIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'name',
        value: '',
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      nameIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'name',
        value: '',
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> symbolEqualTo(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      symbolGreaterThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        include: include,
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      symbolLessThan(
    String value, {
    bool include = false,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.lessThan(
        include: include,
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> symbolBetween(
    String lower,
    String upper, {
    bool includeLower = true,
    bool includeUpper = true,
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.between(
        property: r'symbol',
        lower: lower,
        includeLower: includeLower,
        upper: upper,
        includeUpper: includeUpper,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      symbolStartsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.startsWith(
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      symbolEndsWith(
    String value, {
    bool caseSensitive = true,
  }) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.endsWith(
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      symbolContains(String value, {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.contains(
        property: r'symbol',
        value: value,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition> symbolMatches(
      String pattern,
      {bool caseSensitive = true}) {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.matches(
        property: r'symbol',
        wildcard: pattern,
        caseSensitive: caseSensitive,
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      symbolIsEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.equalTo(
        property: r'symbol',
        value: '',
      ));
    });
  }

  QueryBuilder<ContractEnum, ContractEnum, QAfterFilterCondition>
      symbolIsNotEmpty() {
    return QueryBuilder.apply(this, (query) {
      return query.addFilterCondition(FilterCondition.greaterThan(
        property: r'symbol',
        value: '',
      ));
    });
  }
}

extension ContractEnumQueryObject
    on QueryBuilder<ContractEnum, ContractEnum, QFilterCondition> {}

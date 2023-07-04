import json
import math
import requests

#  Location Process
from deep_diary.config import Amap_api_key


def GPS_format(data):
    """
    对经度和纬度数据做处理，保留6位小数
    :param data: 原始经度和纬度值
    :return:
    """
    print(f'original GPS string: {data}')
    if not data:
        return None

    # 删除左右括号和空格
    data_list = str(data).split(' ')
    # data_list = [data.strip() for data in data_list_tmp]

    # 度的值
    data_tmp = data_list[0].split('/')
    temp_degree = int(data_tmp[0]) / int(data_tmp[1])
    print(f'original GPS temp_degree string: {temp_degree}')
    # 分的值， 单位为度
    # 替换分秒的值
    data_tmp = data_list[1].split('/')
    temp_min = int(data_tmp[0]) / int(data_tmp[1])
    print(f'original GPS temp_min string: {temp_min}')
    # 秒的值  单位为度
    data_tmp = data_list[2].split('/')
    temp_sec = int(data_tmp[0]) / int(data_tmp[1])
    print(f'original GPS temp_sec string: {temp_sec}')

    # original GPS string: 121/1 8249816/1000000 0/1
    # original GPS string: 121/1 7/1 55350952/1000000
    # need combine those 2 format, so need to change degree together
    data_degree = temp_degree + temp_min / 60 + temp_sec / 3600
    print(f'original GPS data_degree value: {data_degree}')
    # 由于高德API只能识别到小数点后的6位
    # 需要转换为浮点数，并保留为6位小数
    result = "%.6f" % data_degree  # 单位为度
    return float(result)


def GPS_to_coordinate(longitude, latitude):
    # 注意：由于gps获取的坐标在国内高德等主流地图上逆编码不够精确，这里需要转换为火星坐标系
    # print(longitude, latitude)
    # print(type(longitude), type(latitude))
    long_lati = wgs84togcj02(longitude, latitude)
    # long_lati = f'{long_lati[0]},{long_lati[1]}'
    # print(long_lati)
    return long_lati


def GPS_get_address(long_lati):
    """
    根据坐标得到详细地址
    :param long_lati: 经纬度值
    :return:
    """
    addr = []  # 5级地址，依次从小到大
    api_key = Amap_api_key  # 高德账户API密钥
    url_get_position = 'https://restapi.amap.com/v3/geocode/regeo?key={}&location={}'
    resp = requests.get(
        url_get_position.format(api_key, long_lati))
    location_data = json.loads(resp.text)
    regeocode = location_data.get('regeocode')
    addressComponent = regeocode.get('addressComponent')
    # 拍摄地
    location = regeocode.get('formatted_address')
    # addr.append(location)
    # self.location = self.location.replace('(', '').replace(')', '') # 替换地址中的括号
    # 拍摄区县
    district = addressComponent.get('district')
    # addr.append(district)
    # 拍摄城市
    city = addressComponent.get('city')
    # addr.append(city)
    # 拍摄省份
    province = addressComponent.get('province')
    # addr.append(province)
    # 拍摄国家
    country = addressComponent.get('country')
    # addr.append(country)
    return location, district, city, province, country


x_pi = 3.14159265358979324 * 3000.0 / 180.0
pi = 3.1415926535897932384626  # π
a = 6378245.0  # 长半轴
ee = 0.00669342162296594323  # 扁率


def wgs84togcj02(lng, lat):
    """
    WGS84转GCJ02(火星坐标系)
    :param lng:WGS84坐标系的经度
    :param lat:WGS84坐标系的纬度
    :return:
    """
    if out_of_china(lng, lat):  # 判断是否在国内
        return lng, lat
    dlat = transformlat(lng - 105.0, lat - 35.0)
    dlng = transformlng(lng - 105.0, lat - 35.0)
    radlat = lat / 180.0 * pi
    magic = math.sin(radlat)
    magic = 1 - ee * magic * magic
    sqrtmagic = math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi)
    dlng = (dlng * 180.0) / (a / sqrtmagic * math.cos(radlat) * pi)
    mglat = lat + dlat
    mglng = lng + dlng
    return [mglng, mglat]


def gcj02towgs84(lng, lat):
    """
    GCJ02(火星坐标系)转GPS84
    :param lng:火星坐标系的经度
    :param lat:火星坐标系纬度
    :return:
    """
    if out_of_china(lng, lat):
        return lng, lat
    dlat = transformlat(lng - 105.0, lat - 35.0)
    dlng = transformlng(lng - 105.0, lat - 35.0)
    radlat = lat / 180.0 * pi
    magic = math.sin(radlat)
    magic = 1 - ee * magic * magic
    sqrtmagic = math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi)
    dlng = (dlng * 180.0) / (a / sqrtmagic * math.cos(radlat) * pi)
    mglat = lat + dlat
    mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]


def transformlat(lng, lat):
    ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + \
          0.1 * lng * lat + 0.2 * math.sqrt(math.fabs(lng))
    ret += (20.0 * math.sin(6.0 * lng * pi) + 20.0 *
            math.sin(2.0 * lng * pi)) * 2.0 / 3.0
    ret += (20.0 * math.sin(lat * pi) + 40.0 *
            math.sin(lat / 3.0 * pi)) * 2.0 / 3.0
    ret += (160.0 * math.sin(lat / 12.0 * pi) + 320 *
            math.sin(lat * pi / 30.0)) * 2.0 / 3.0
    return ret


def transformlng(lng, lat):
    ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + \
          0.1 * lng * lat + 0.1 * math.sqrt(math.fabs(lng))
    ret += (20.0 * math.sin(6.0 * lng * pi) + 20.0 *
            math.sin(2.0 * lng * pi)) * 2.0 / 3.0
    ret += (20.0 * math.sin(lng * pi) + 40.0 *
            math.sin(lng / 3.0 * pi)) * 2.0 / 3.0
    ret += (150.0 * math.sin(lng / 12.0 * pi) + 300.0 *
            math.sin(lng / 30.0 * pi)) * 2.0 / 3.0
    return ret


def out_of_china(lng, lat):
    """
    判断是否在国内，不在国内不做偏移
    :param lng:
    :param lat:
    :return:
    """
    if lng < 72.004 or lng > 137.8347:
        return True
    if lat < 0.8293 or lat > 55.8271:
        return True
    return False

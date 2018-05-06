import axios from 'axios'

function fetchDataBySFC (sfc) {
  const sql = `
  WITH SFC_DC_DATA AS (
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'ULTRASONIC_WELD' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_ULTRASONIC_WELD
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'ASSEMBLY_FIXTURE' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_ASSEMBLY_FIXTURE
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'MYLAR' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_PACK_MYLAR
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'INTO_SHELL' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_CELL_INTO_SHELL
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'PREPARE_WELD' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_PREPARE_COVER_WELD
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'FULL_WELD' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_FULL_COVER_WELD
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'HELIUNTEST1' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OFFLINE_HELIUNTEST1
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,SFC_NO,RESOURCE_NO,'BAKING' AS PROCESS_NO,BAKE_END_TIME AS DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OFFLINE_BAKING
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'INJECTION1' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OFFLINE_INJECTION1
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,SFC_NO,RESOURCE_NO,'GAOWEN_STEWING' AS PROCESS_NO,STEWING_END_TIME AS DC_TIME,RESULT,CREATE_USER FROM SFC_DC_GAOWEN_STEWING
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,CELL_ID AS SFC_NO,NULL AS RESOURCE_NO,'FORMATION' AS PROCESS_NO,ECS_update_time AS DC_TIME,RESULT,NULL AS CREATE_USER FROM BATTERY_FORMATION
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,SFC AS SFC_NO,RESOURCE_NO,'STEWING_LAOHUA' AS PROCESS_NO,STEWING_END_TIME AS DC_TIME,RESULT,CREATE_USER FROM SFC_DC_STEWING_LAOHUA
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'INJECTION2' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OFFLINE_INJECTION2
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'WASH_WELD' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_SEAL_WASHING_WELDING
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,'HELIUNTEST2' AS PROCESS_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OFFLINE_HELIUNTEST2
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,SFC AS SFC_NO,RESOURCE_NO,'OCV1_STEWING' AS PROCESS_NO,STEWING_END_TIME AS DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OCV1_STEWING
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,cell_id AS SFC_NO,NULL AS RESOURCE_NO,'COCV1' AS PROCESS_NO,DC_TIME,NULL AS RESULT,NULL AS CREATE_USER FROM Battery_OCV WHERE procedu_no = 'OCV1'
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,SFC AS SFC_NO,RESOURCE_NO,'OCVB_STEWING' AS PROCESS_NO,STEWING_END_TIME AS DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OCVB_STEWING
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,cell_id AS SFC_NO,NULL AS RESOURCE_NO,'OCVB' AS PROCESS_NO,DC_TIME,NULL AS RESULT,NULL AS CREATE_USER FROM Battery_OCV WHERE procedu_no = 'OCVB'
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,cell_id AS SFC_NO,NULL AS RESOURCE_NO,'CAPACITY' AS PROCESS_NO,EndTime AS DC_TIME,NULL AS RESULT,NULL AS CREATE_USER FROM Battery_Capacity
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,SFC AS SFC_NO,RESOURCE_NO,'OCV2_STEWING' AS PROCESS_NO,STEWING_END_TIME AS DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OCV2_STEWING
  UNION ALL
  SELECT NULL AS SHOP_ORDER,NULL AS STATION_CODE,cell_id AS SFC_NO,NULL AS RESOURCE_NO,'OCV2' AS PROCESS_NO,DC_TIME,NULL AS RESULT,NULL AS CREATE_USER FROM Battery_OCV WHERE procedu_no = 'OCV2'
  UNION ALL
  SELECT SHOP_ORDER,STATION_CODE,SFC_NO,RESOURCE_NO,OPERATION_NO,DC_TIME,RESULT,CREATE_USER FROM SFC_DC_OFFLINE_SIZE_TEST
  )
  SELECT D.SHOP_ORDER AS 工单, D.SFC_NO AS 条码, W.group_name AS 工序组, ISNULL(PL.process_name, D.PROCESS_NO) AS 工序, ISNULL(S.station_name, D.STATION_CODE) AS 工站, D.DC_TIME AS 生产时间, D.RESULT AS 结果, ISNULL(E.emp_name, D.CREATE_USER) AS 员工 FROM SFC_DC_DATA D
  LEFT JOIN B_ProcessList PL ON D.PROCESS_NO = PL.process_code
  LEFT JOIN S_Employee E ON E.emp_code = D.CREATE_USER
  LEFT JOIN B_WorkGroup W ON W.group_code = PL.group_code
  LEFT JOIN B_StationList S ON S.station_code = D.STATION_CODE
  WHERE SFC_NO = @sfc
  ORDER BY W.group_code, PL.idx`
  return axios.post('/DataAPI/ReportData.ashx?method=FetchData', {sql, queryParams: {sfc}}).then(res => res.data)
}

function fetchProcessDataBySFC (sfc, processName) {
  const sqlMap = {
    '卷绕': 'SELECT * FROM SFC_DC_WINDING WHERE SFC_NO = @sfc',
    '热压': 'SELECT * FROM SFC_DC_HOT_PRESSURE WHERE SFC_NO = @sfc',
    '蓝胶刻码': 'SELECT * FROM SFC_DC_BLUE_TAPE_ENGRAVE WHERE SFC_NO = @sfc',
    '裸电芯配对': 'SELECT * FROM SFC_DC_ASSEMBLY_CELL WHERE SFC_NO = @sfc',
    '顶盖刻码/软连接焊接': 'SELECT * FROM SFC_DC_SOFT_CONNECT_WELD WHERE SFC_NO = @sfc',
    '超声波焊接': 'SELECT * FROM SFC_DC_ULTRASONIC_WELD WHERE SFC_NO = @sfc',
    '装支架': 'SELECT * FROM SFC_DC_ASSEMBLY_FIXTURE WHERE SFC_NO = @sfc',
    '包Mylar': 'SELECT * FROM SFC_DC_PACK_MYLAR WHERE SFC_NO = @sfc',
    '电芯入壳': 'SELECT * FROM SFC_DC_CELL_INTO_SHELL WHERE SFC_NO = @sfc',
    '顶盖预焊': 'SELECT * FROM SFC_DC_PREPARE_COVER_WELD WHERE SFC_NO = @sfc',
    '顶盖满焊': 'SELECT * FROM SFC_DC_FULL_COVER_WELD WHERE SFC_NO = @sfc',
    '一次氦检': 'SELECT * FROM SFC_DC_OFFLINE_HELIUNTEST1 WHERE SFC_NO = @sfc',
    '电芯烘烤': 'SELECT * FROM SFC_DC_OFFLINE_BAKING WHERE SFC_NO = @sfc',
    '一次注液': 'SELECT * FROM SFC_DC_OFFLINE_INJECTION1 WHERE SFC_NO = @sfc',
    '高温静置1': 'SELECT * FROM SFC_DC_GAOWEN_STEWING WHERE SFC_NO = @sfc',
    '负压化成': 'SELECT * FROM BATTERY_FORMATION WHERE cell_id = @sfc',
    '高温静置2': 'SELECT * FROM SFC_DC_STEWING_LAOHUA WHERE SFC = @sfc',
    '二次注液': 'SELECT * FROM SFC_DC_OFFLINE_INJECTION2 WHERE SFC_NO = @sfc',
    '清洗和密封钉焊接': 'SELECT * FROM SFC_DC_SEAL_WASHING_WELDING WHERE SFC_NO = @sfc',
    '二次氦检': 'SELECT * FROM SFC_DC_OFFLINE_HELIUNTEST2 WHERE SFC_NO = @sfc',
    'OCV1前静置': 'SELECT * FROM SFC_DC_OCV1_STEWING WHERE SFC = @sfc',
    'OCV1': 'SELECT * FROM Battery_OCV WHERE cell_id = @sfc AND procedu_no = \'OCV1\'',
    'OCVB前静置': 'SELECT * FROM SFC_DC_OCVB_STEWING WHERE SFC = @sfc',
    'OCVB': 'SELECT * FROM Battery_OCV WHERE cell_id = @sfc AND procedu_no = \'OCVB\'',
    '容量检测': 'SELECT * FROM Battery_Capacity WHERE cell_id = @sfc',
    'OCV2前静置': 'SELECT * FROM SFC_DC_OCV2_STEWING WHERE SFC = @sfc',
    'OCV2': 'SELECT * FROM Battery_OCV WHERE cell_id = @sfc AND procedu_no = \'OCV2\'',
    '包膜和尺寸测试': 'SELECT * FROM SFC_DC_OFFLINE_SIZE_TEST WHERE SFC_NO = @sfc'
  }
  const sql = sqlMap[processName]
  return axios.post('/DataAPI/ReportData.ashx?method=FetchData', {sql, queryParams: {sfc}}).then(res => res.data)
}

function fetchFields (processName) {
  const reportCodeMap = {
    '卷绕': 'SFC_DC_WINDING',
    '热压': 'SFC_DC_HOT_PRESSURE',
    '蓝胶刻码': 'SFC_DC_BLUE_TAPE_ENGRAVE',
    '裸电芯配': 'SFC_DC_ASSEMBLY_CELL',
    '顶盖刻码/软连接焊接': 'SFC_DC_SOFT_CONNECT_WELD',
    '超声波焊': 'SFC_DC_ULTRASONIC_WELD',
    '装支': 'SFC_DC_ASSEMBLY_FIXTURE',
    '包Mylar': 'SFC_DC_PACK_MYLAR',
    '电芯入壳': 'SFC_DC_CELL_INTO_SHELL',
    '顶盖预焊': 'SFC_DC_PREPARE_COVER_WELD',
    '顶盖满焊': 'SFC_DC_FULL_COVER_WELD',
    '一次氦检': 'SFC_DC_OFFLINE_HELIUNTEST1',
    '电芯烘烤': 'SFC_DC_OFFLINE_BAKING',
    '一次注液': 'SFC_DC_OFFLINE_INJECTION1',
    '高温静置1': 'SFC_DC_GAOWEN_STEWING',
    '负压化成': 'BATTERY_FORMATION',
    '高温静置2': 'SFC_DC_STEWING_LAOHUA',
    '二次注液': 'SFC_DC_OFFLINE_INJECTION2',
    '清洗和密封钉焊接': 'SFC_DC_SEAL_WASHING_WELDING',
    '二次氦检': 'SFC_DC_OFFLINE_HELIUNTEST2',
    'OCV1前静': 'SFC_DC_OCV1_STEWING',
    'OCV1': 'Battery_OCV',
    'OCVB前静': 'SFC_DC_OCVB_STEWING',
    'OCVB': 'Battery_OCV',
    '容量检测': 'Battery_Capacity',
    'OCV2前静': 'SFC_DC_OCV2_STEWING',
    'OCV2': 'Battery_OCV'
  }
  const reportCode = reportCodeMap[processName]
  return axios.get(`/DataAPI/Commom.ashx?ActType=GetColumns&reportCode=${reportCode}`).then(res => res.data)
}

export default {
  fetchFields,
  fetchDataBySFC,
  fetchProcessDataBySFC
}

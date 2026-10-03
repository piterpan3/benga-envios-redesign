import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, '../../db.json');

const defaultData = {
  users: [],
  shipments: [],
  addresses: [],
  ratings: [],
  settings: {
    pricePerKg: 12.50,
    deliveryFeeLuanda: { min: 4000, max: 15000 },
    deliveryFeeOutside: { min: 20000, max: 30000 },
    phone: '+351931743081',
    whatsapp: '+351931743081',
    bankAccountsPT: 'PT50 0193 0000 10507750890 11',
    bankAccountsPTName: 'Rachid Gomes',
    bankAccountsAO: '0040.0000.5256.1892.1014.3',
    bankAccountsAOName: 'Rachid Gomes',
    shipmentStates: [
      'Pendente',
      'Recebida',
      'Em preparação',
      'No armazém',
      'Em trânsito',
      'Chegou ao destino',
      'Em entrega',
      'Entregue',
      'Cancelada'
    ],
    commodityTypes: [
      'Roupa',
      'Calçado',
      'Eletrónica',
      'Documentos',
      'Alimentos',
      'Produtos diversos',
      'Outros'
    ],
    electronicEquipment: [
      { id: 'laptop', name: 'Portátil', pricePerUnit: null },
      { id: 'phone', name: 'Telemóvel', pricePerUnit: null },
      { id: 'tablet', name: 'Tablet', pricePerUnit: null },
      { id: 'monitor', name: 'Monitor', pricePerUnit: null },
      { id: 'printer', name: 'Impressora', pricePerUnit: null }
    ]
  },
  supportMessages: [],
  auditLog: []
};

let data = null;

const database = {
  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      } else {
        data = JSON.parse(JSON.stringify(defaultData));
        this.save();
      }
    } catch (error) {
      console.error('Database init error:', error);
      data = JSON.parse(JSON.stringify(defaultData));
    }
  },

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Database save error:', error);
    }
  },

  get() {
    return data;
  },

  addAuditLog(action, userId, details) {
    data.auditLog.push({
      timestamp: new Date().toISOString(),
      action,
      userId,
      details
    });
    this.save();
  }
};

export default database;

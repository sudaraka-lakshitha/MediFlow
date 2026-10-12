import { describe,expect,it } from 'vitest';
import { billingPreview } from '../src/utils/billingPreview.js';
import { planPrescriptionItems } from '../src/utils/preservePrescriptionItems.js';

describe('in-app billing preview',()=>{
  it('includes bill contents but excludes PIN secrets and unrelated patient data',()=>{
    const data=billingPreview({requestNumber:'PAY-1',patient:{fullName:'Example',passwordHash:'secret'},pickupPinHash:'secret',pickupPinEncrypted:'secret',items:[{id:1,product:{genericName:'Medicine',strength:'5 mg',internal:'private'},quantity:2,unitPrice:10,lineTotal:20}]});
    expect(data.reference).toBe('PAY-1');expect(data.customer).toBe('Example');
    expect(data.items[0].name).toBe('Medicine 5 mg');expect(JSON.stringify(data)).not.toContain('secret');expect(JSON.stringify(data)).not.toContain('private');
  });
});
describe('prescription line history',()=>{
  const existing=[{id:1,productId:2,cancelledQuantity:2,dispensedQuantity:1}];
  it('keeps the identity of edited historical lines',()=>{
    const plan=planPrescriptionItems(existing,[{productId:2,prescribedQuantity:5}],[{id:1}]);
    expect(plan.updates[0]).toEqual({id:1,data:{productId:2,prescribedQuantity:5}});expect(plan.removed).toEqual([]);expect(plan.creates).toEqual([]);
  });
  it('rejects removing historical lines',()=>expect(()=>planPrescriptionItems(existing,[],[])).toThrow('history'));
  it('rejects reducing quantity below historical cancellations and dispensing',()=>expect(()=>planPrescriptionItems(existing,[{productId:2,prescribedQuantity:2}],[{id:1}])).toThrow('smaller'));
  it('rejects a stale line identity',()=>expect(()=>planPrescriptionItems(existing,[{productId:2,prescribedQuantity:5}],[{id:999}])).toThrow('changed'));
});

import { Sample } from '../Sample';
import cms from './cms';
import customerInfo from './customer-info';
import k8spodspec from './k8spodspec';

const _samples: Record<string, Sample> = {
  'Kubernetes PodSpec': k8spodspec,
  'High school examinee management app': customerInfo,
  CMS: cms,
};

export default { ..._samples };

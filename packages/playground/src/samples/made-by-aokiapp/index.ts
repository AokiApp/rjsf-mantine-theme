import { Sample } from '../Sample';
import k8spodspec from './k8spodspec';

const _samples: Record<string, Sample> = {
  'Kubernetes PodSpec': k8spodspec,
};

export default { ..._samples };

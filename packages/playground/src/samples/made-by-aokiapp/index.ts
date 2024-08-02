import { Sample } from '../Sample';
import cms from './cms';
import customerInfo from './hsema';
import files from './files';
import k8spodspec from './k8spodspec';

const _samples: Record<string, Sample> = {
  'Kubernetes PodSpec': k8spodspec,
  'High school examinee management app': customerInfo,
  CMS: cms,
  Files: files,
};

export default { ..._samples };

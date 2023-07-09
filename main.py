import matplotlib.pyplot as plt
import numpy as np


# def sample_triangular(extent) -> float:
#     random_num = np.random.rand()
#     if random_num < 0.5:
#         return -extent + np.sqrt(random_num * 2 * extent**2)
#     else:
#         return extent - np.sqrt((1 - random_num) * 2 * extent**2)


class Jitter:
    current_jitter: int = 0

    def _sample_triangular(self, extent: float) -> float:
        random_num = np.random.rand()
        if random_num < 0.5:
            return -extent + np.sqrt(random_num * 2 * extent**2)
        else:
            return extent - np.sqrt((1 - random_num) * 2 * extent**2)

    def get_jitter(self) -> int:
        extent = 4
        sample = self._sample_triangular(extent)
        sample = int(np.rint(sample))

        if (sample < self.current_jitter):
            self.current_jitter = np.maximum(self.current_jitter - 1, -extent)
        elif (sample > self.current_jitter):
            self.current_jitter = np.minimum(self.current_jitter + 1, extent)

        return self.current_jitter


jitter = Jitter()

# h = plt.hist([jitter.get_jitter() for _ in range(100000)], bins=200, density=True)

plt.plot(range(1000), [150 + jitter.get_jitter() for _ in range(1000)])
plt.show()
pass

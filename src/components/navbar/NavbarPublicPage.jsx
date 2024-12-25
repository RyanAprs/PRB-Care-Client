import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  HomeIcon,
  Hospital,
  HousePlus,
  LogIn,
  ScrollText,
} from "lucide-react";
import { ThemeSwitcher } from "../themeSwitcher/ThemeSwitcher";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
const NavbarPublicPage = () => {
  const toast = useRef(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/pengguna/login");
  };
  return (
    <>
      <header className=" font-poppins top-0 left-0 right-0 z-50 flex justify-between  items-center py-4 md:py-6 px-5 md:px-10 transition-colors ">
        <div className="flex items-center justify-center font-poppins text-2xl gap-1">
          <svg
            width={`50`}
            viewBox="0 0 850 890"
          >
          </svg>
        </div>
      </header>

      <header className="fixed navbar-top font-poppins top-0 left-0 right-0 z-50 flex justify-between bg-white dark:bg-blackHover text-white items-center py-4 md:py-6 px-5 md:px-10 transition-colors duration-300 ">
        <Toast
          ref={toast}
          position={window.innerWidth <= 767 ? "top-center" : "top-right"}
        />
        <div className="flex items-center justify-center font-poppins text-2xl gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`50`}
            viewBox="0 0 850 890"
          >
            <g transform="translate(5, 5) scale(0.98)">
              <path
                d="M 337.419 55.054 C 333.176 56.315, 330.929 59.107, 330.284 63.922 L 329.737 68 281.543 68 L 233.350 68 226.225 70.424 C 194.109 81.347, 173.740 105.312, 165.814 141.500 C 164.746 146.377, 164.500 199.923, 164.500 427.500 C 164.500 655.077, 164.746 708.623, 165.814 713.500 C 172.422 743.670, 188.191 766.073, 211.273 778.081 C 215.577 780.321, 222.306 783.244, 226.225 784.576 L 233.350 787 320.458 787 L 407.565 787 411.310 798.380 C 418.877 821.369, 428.476 837.753, 442.569 851.732 C 456.935 865.982, 471.617 874.624, 490.162 879.747 C 495.067 881.102, 500.343 881.494, 513.500 881.480 C 534.144 881.459, 541.836 879.744, 558.500 871.450 C 577.685 861.901, 589.238 850.522, 598.046 832.500 C 603.078 822.204, 609.557 801.522, 610.654 792.250 C 611.231 787.373, 611.466 787, 613.963 787 C 617.929 787, 629.806 782.722, 638.727 778.081 C 661.809 766.073, 677.578 743.670, 684.186 713.500 C 685.254 708.623, 685.500 655.077, 685.500 427.500 C 685.500 199.923, 685.254 146.377, 684.186 141.500 C 677.578 111.330, 661.809 88.927, 638.727 76.919 C 634.423 74.679, 627.694 71.756, 623.775 70.424 L 616.650 68 568.457 68 L 520.263 68 519.694 63.752 C 518.986 58.474, 515.648 55.364, 509.769 54.504 C 507.421 54.160, 492.574 54.019, 476.776 54.190 C 440.119 54.586, 443.469 52.224, 443.584 77.593 C 443.660 94.465, 443.838 96.277, 445.584 97.971 C 447.343 99.678, 450.247 99.888, 481 100.527 C 514.441 101.222, 514.505 101.219, 517.250 99.039 C 519.412 97.321, 520 96.016, 520 92.927 L 520 89 538.750 88.819 C 549.063 88.720, 568.750 88.764, 582.500 88.917 C 607.064 89.191, 607.654 89.246, 616.342 92.109 C 630.943 96.922, 642.812 104.985, 650.658 115.422 C 658.855 126.327, 662.421 135.864, 663.894 150.826 C 665.270 164.801, 665.367 690.434, 663.995 703.674 C 662.946 713.801, 660.423 723.290, 656.990 730.019 C 651.795 740.202, 641.303 750.758, 630 757.172 C 626.371 759.231, 614.925 764, 613.611 764 C 613.439 764, 613.027 753.763, 612.696 741.250 C 611.578 698.993, 607.169 672.825, 594.794 635 C 584.631 603.934, 568.746 570.746, 551.639 544.832 L 549.877 542.164 567.533 523.910 C 586.871 503.916, 598.472 490.783, 607.647 478.500 C 620.881 460.783, 623.981 456.467, 623.990 455.750 C 623.996 455.337, 619.837 455.030, 614.750 455.067 L 605.500 455.135 595 468.233 C 589.225 475.436, 579.775 486.187, 574 492.124 C 568.225 498.060, 558.557 508.111, 552.516 514.458 C 546.475 520.806, 541.075 525.976, 540.516 525.946 C 539.957 525.916, 536.575 522.067, 533 517.392 C 525.573 507.680, 518.471 500.137, 501.656 484.101 L 489.812 472.805 490.980 468.166 C 491.622 465.614, 492.547 463.046, 493.034 462.459 C 493.522 461.871, 494.217 457.815, 494.580 453.445 C 495.734 439.528, 491.815 422.691, 484.872 411.736 C 476.664 398.787, 462.357 387.331, 448.876 382.916 C 442.363 380.783, 439.687 380.500, 426 380.500 C 412.313 380.500, 409.637 380.783, 403.124 382.916 C 384.830 388.908, 367.747 405.651, 361.449 423.760 C 355.699 440.294, 355.763 455.620, 361.641 469.841 C 363.609 474.604, 365.307 479.223, 365.414 480.107 C 366.073 485.564, 379.618 500.472, 389.736 506.876 C 401.662 514.425, 419.722 518.204, 434.452 516.233 C 450.204 514.126, 462.007 508.684, 472.866 498.522 L 478.232 493.500 485.270 501 C 494.215 510.532, 506.798 525.111, 515.404 535.913 L 522.107 544.325 518.803 547.469 C 512.412 553.551, 502.378 562.543, 497.566 566.500 C 494.891 568.700, 491.307 571.730, 489.601 573.233 C 487.896 574.736, 485.803 576.536, 484.952 577.233 C 484.100 577.930, 481.400 580.206, 478.952 582.292 C 472.056 588.166, 471.783 588.389, 467 592.038 C 464.525 593.926, 461.993 595.928, 461.373 596.486 C 460.752 597.044, 459.222 598.175, 457.971 599 C 456.721 599.825, 452.503 602.981, 448.599 606.014 C 444.694 609.047, 440.375 612.254, 439 613.142 C 437.625 614.029, 434.925 616.153, 433 617.862 C 431.075 619.570, 428.994 620.975, 428.376 620.984 C 426.833 621.006, 407 606.128, 407 604.948 C 407 604.427, 406.512 604, 405.916 604 C 404.676 604, 396.308 597.671, 384.101 587.500 C 379.480 583.650, 373.376 578.700, 370.538 576.500 C 367.699 574.300, 363.604 570.853, 361.438 568.839 C 359.272 566.826, 355.025 563.043, 352 560.434 C 344.190 553.696, 323.049 533.850, 314.254 525 C 300.637 511.298, 277.527 486.906, 276.611 485.269 C 276.115 484.382, 273.270 481.146, 270.290 478.078 C 267.309 475.010, 262.344 468.788, 259.255 464.250 L 253.639 456 242.820 456 C 236.869 456, 232 456.201, 232 456.446 C 232 457.615, 256.878 489.713, 264.982 499 C 277.340 513.162, 315.147 551.156, 333 567.355 C 357.184 589.299, 393.697 618.800, 417.127 635.326 C 424.777 640.722, 429.252 641.363, 434.963 637.882 C 449.663 628.920, 500.469 588.102, 525.424 565.204 L 533.376 557.907 540.743 569.204 C 566.942 609.375, 584.113 651.520, 590.502 691.332 C 592.765 705.432, 594.956 735.112, 594.979 752 L 595 766.500 419.250 766.380 L 243.500 766.260 234.158 763.118 C 218.939 758, 207.248 750.096, 199.342 739.578 C 191.018 728.505, 187.596 719.191, 185.967 703.174 C 184.584 689.575, 184.720 166.389, 186.111 151.339 C 188.375 126.837, 199.226 109.742, 220.158 97.703 C 226.552 94.025, 241.593 89.116, 248.764 88.367 C 252.025 88.026, 271.637 88.082, 292.346 88.490 L 330 89.233 330 93.044 C 330 96.005, 330.613 97.342, 332.750 99.039 C 335.495 101.219, 335.559 101.222, 369 100.527 C 399.753 99.888, 402.657 99.678, 404.416 97.971 C 406.162 96.277, 406.340 94.465, 406.416 77.593 C 406.531 52.113, 410.214 54.549, 371.224 54.320 C 354.326 54.220, 339.113 54.551, 337.419 55.054 M 309.908 266.902 C 296.024 269.915, 290.094 271.882, 279.500 276.989 C 261.118 285.852, 245.068 300.073, 233.216 318 C 225.825 329.178, 220.796 340.788, 216.973 355.500 C 213.877 367.413, 213.857 367.649, 214.269 388 C 214.713 409.943, 215.986 417.189, 222.661 435.750 L 225.268 443 235.634 443 C 241.820 443, 246 442.600, 246 442.008 C 246 441.463, 243.779 436.625, 241.066 431.258 C 238.352 425.891, 235.444 418.800, 234.604 415.500 C 230.250 398.398, 229.967 371.953, 234.002 359.365 C 236.881 350.385, 237.221 349.501, 240.348 342.900 C 241.806 339.820, 243.002 336.670, 243.004 335.900 C 243.016 332.229, 257.009 314.918, 266.500 306.836 C 274.050 300.406, 287.454 292.443, 295.500 289.607 C 298.250 288.638, 301.400 287.467, 302.500 287.006 C 311.688 283.152, 335.432 281.865, 348.936 284.488 C 353.943 285.460, 358.283 286.648, 358.579 287.128 C 358.876 287.608, 359.879 288.005, 360.809 288.012 C 363.500 288.032, 376.904 294.217, 384 298.714 C 395.556 306.038, 402.735 312.166, 412.666 323.184 C 426.603 338.647, 429.510 338.800, 441.500 324.702 C 460.258 302.646, 483.433 288.139, 506.434 284.054 C 513.999 282.710, 531.583 282.709, 540 284.052 C 547.169 285.196, 561.760 289.876, 567.693 292.936 C 569.787 294.015, 572.625 295.390, 574 295.992 C 580.168 298.691, 589.703 305.738, 596.301 312.474 C 608.288 324.713, 615.625 336.919, 621.560 354.500 C 624.952 364.547, 625.317 366.707, 625.771 379.426 C 626.316 394.713, 624.926 407.265, 621.785 415.429 C 620.741 418.140, 618.803 423.463, 617.478 427.256 C 616.153 431.050, 614.153 435.635, 613.034 437.445 C 611.915 439.255, 611 441.020, 611 441.368 C 611 441.716, 615.256 442, 620.458 442 L 629.916 442 632.355 437.750 C 636.291 430.895, 641.338 410.089, 642.969 394 C 645.810 365.969, 635.001 330.726, 616.887 308.960 C 593.207 280.505, 564.878 266.516, 528.364 265.247 C 519.663 264.944, 511.589 265.211, 507.364 265.942 C 477.665 271.076, 450.764 286.007, 433.440 306.972 L 428.550 312.889 417.025 301.633 C 403.552 288.473, 396.741 283.633, 381.592 276.454 C 365.248 268.709, 352.350 265.729, 333.500 265.344 C 321.720 265.103, 316.656 265.438, 309.908 266.902 M 431 788.071 C 431 788.659, 433.242 793.743, 435.982 799.368 C 443.784 815.382, 452.159 827.276, 463.941 839.074 C 472.509 847.653, 475.914 850.328, 482 853.257 C 492.253 858.192, 500.107 860.005, 511.686 860.113 C 533.674 860.316, 552.762 853.234, 566.838 839.651 C 574.434 832.321, 583.183 819.733, 584.560 814.152 C 584.785 813.243, 586.059 808.879, 587.392 804.454 C 588.725 800.028, 590.134 794.291, 590.522 791.704 L 591.227 787 511.114 787 C 454.848 787, 431 787.319, 431 788.071"
                stroke="none"
                fill-rule="evenodd"
                className="logo-prbcare"
              />
              <path
                d="M 392.500 10.626 C 375.923 12.302, 359.470 14.519, 348 16.624 C 177.873 47.835, 43.835 181.873, 12.624 352 C 7.345 380.770, 6.515 391.099, 6.515 428 C 6.515 464.901, 7.345 475.230, 12.624 504 C 33.988 620.451, 104.417 722.910, 205.643 784.799 C 249.287 811.483, 295.600 829.423, 345.482 838.968 C 367.950 843.268, 385.996 845.114, 411.318 845.702 L 436.137 846.278 430.419 837.889 C 422.897 826.851, 415.967 812.529, 411.326 798.428 L 407.565 787 320.458 787 L 233.350 787 226.225 784.576 C 194.109 773.653, 173.740 749.688, 165.814 713.500 C 163.871 704.627, 163.871 150.373, 165.814 141.500 C 172.422 111.330, 188.191 88.927, 211.273 76.919 C 215.577 74.679, 222.306 71.756, 226.225 70.424 L 233.350 68 281.543 68 L 329.737 68 330.306 63.752 C 331.014 58.474, 334.352 55.364, 340.231 54.504 C 342.579 54.160, 357.426 54.019, 373.224 54.190 C 409.203 54.578, 406.359 52.984, 406.826 73.025 L 407.151 87 425 87 L 442.849 87 443.174 73.025 C 443.641 52.984, 440.797 54.578, 476.776 54.190 C 492.574 54.019, 507.421 54.160, 509.769 54.504 C 515.648 55.364, 518.986 58.474, 519.694 63.752 L 520.263 68 568.457 68 L 616.650 68 623.775 70.424 C 655.891 81.347, 676.260 105.312, 684.186 141.500 C 685.254 146.377, 685.500 199.923, 685.500 427.500 C 685.500 655.077, 685.254 708.623, 684.186 713.500 C 677.578 743.670, 661.809 766.073, 638.727 778.081 C 629.689 782.783, 617.915 787, 613.825 787 C 611.414 787, 610.998 787.403, 610.984 789.750 C 610.976 791.263, 610.359 795.091, 609.614 798.258 L 608.259 804.017 618.879 798.338 C 733.225 737.202, 812.310 629.682, 835.376 504 C 840.654 475.239, 841.485 464.903, 841.485 428 C 841.485 391.097, 840.654 380.761, 835.376 352 C 804.329 182.831, 671.756 49.417, 502.518 17.032 C 476.158 11.987, 463.003 10.821, 429 10.515 C 411.125 10.353, 394.700 10.404, 392.500 10.626 M 258.250 88.747 C 264.712 88.921, 275.288 88.921, 281.750 88.747 C 288.212 88.573, 282.925 88.430, 270 88.430 C 257.075 88.430, 251.787 88.573, 258.250 88.747 M 559.750 88.723 C 561.538 88.945, 564.462 88.945, 566.250 88.723 C 568.038 88.502, 566.575 88.320, 563 88.320 C 559.425 88.320, 557.962 88.502, 559.750 88.723 M 374.750 100.737 C 377.637 100.939, 382.363 100.939, 385.250 100.737 C 388.137 100.535, 385.775 100.370, 380 100.370 C 374.225 100.370, 371.863 100.535, 374.750 100.737 M 464.750 100.737 C 467.637 100.939, 472.363 100.939, 475.250 100.737 C 478.137 100.535, 475.775 100.370, 470 100.370 C 464.225 100.370, 461.863 100.535, 464.750 100.737 M 185.447 189 C 185.447 206.875, 185.582 214.188, 185.748 205.250 C 185.914 196.313, 185.914 181.688, 185.748 172.750 C 185.582 163.813, 185.447 171.125, 185.447 189 M 664.458 199.500 C 664.459 223.150, 664.590 232.682, 664.749 220.682 C 664.909 208.683, 664.909 189.333, 664.749 177.682 C 664.589 166.032, 664.458 175.850, 664.458 199.500 M 318 283.637 C 312.161 284.490, 304.356 286.171, 302.500 286.977 C 301.400 287.454, 298.250 288.638, 295.500 289.607 C 287.454 292.443, 274.050 300.406, 266.500 306.836 C 257.009 314.918, 243.016 332.229, 243.004 335.900 C 243.002 336.670, 241.806 339.820, 240.348 342.900 C 231.853 360.834, 229.332 377.736, 231.901 399.530 C 233.548 413.498, 235.399 419.912, 241.333 432.195 L 246.500 442.891 254.576 442.945 C 261.980 442.995, 262.851 442.787, 265.053 440.444 C 266.374 439.038, 269.430 436.579, 271.845 434.979 C 276.026 432.210, 276.377 432.144, 279.180 433.593 C 280.800 434.431, 286.239 438.465, 291.268 442.558 C 296.297 446.651, 300.900 450, 301.497 450 C 302.094 450, 303.552 445.163, 304.738 439.250 C 305.923 433.337, 308.958 418.600, 311.480 406.500 C 314.003 394.400, 316.948 380, 318.024 374.500 C 319.899 364.920, 321.412 362, 324.500 362 C 327.935 362, 329.046 364.777, 331.499 379.500 C 332.873 387.750, 334.243 395.625, 334.542 397 C 335.180 399.927, 339.303 423.646, 344.450 454 C 346.456 465.825, 348.551 477.219, 349.106 479.320 L 350.115 483.141 355.105 474.925 C 359.594 467.534, 359.991 466.413, 359.062 463.747 C 357.270 458.607, 356.706 445.854, 357.925 438.023 C 360.347 422.457, 365.704 411.482, 376.341 400.288 C 386.911 389.165, 401.832 381.460, 415.140 380.254 L 420.812 379.739 421.488 375.120 C 421.859 372.579, 422.614 368.363, 423.165 365.750 C 424.079 361.414, 424.417 361, 427.048 361 C 431.047 361, 431.633 362.306, 433.623 375.637 C 434.227 379.680, 434.346 379.789, 438.870 380.409 C 450.951 382.066, 463.241 388.391, 473.712 398.341 C 485.013 409.080, 491.554 421.827, 494.075 438.023 C 495.342 446.163, 494.621 460.547, 492.838 462.695 C 492.102 463.582, 492.091 464, 492.802 464 C 493.378 464, 496.167 468.050, 499 473 C 501.833 477.950, 504.566 482, 505.075 482 C 505.584 482, 506 481.756, 506 481.458 C 506 481.160, 506.668 477.672, 507.483 473.708 C 508.299 469.744, 510.769 455.925, 512.973 443 C 515.176 430.075, 517.238 418.150, 517.555 416.500 C 518.661 410.739, 521.005 397.386, 523.523 382.500 C 524.918 374.250, 526.487 366.488, 527.009 365.250 C 528.243 362.323, 533.452 362.108, 534.958 364.921 C 535.524 365.978, 537.543 374.416, 539.446 383.671 C 546.871 419.789, 553.217 449.518, 553.581 449.899 C 553.969 450.303, 556.695 448.445, 567.500 440.409 C 578.049 432.564, 579.129 431.999, 581.316 433.169 C 582.401 433.750, 585.186 435.974, 587.506 438.112 L 591.724 442 601.112 441.992 L 610.500 441.985 612.859 437.855 C 614.156 435.584, 616.269 430.718, 617.553 427.042 C 618.837 423.366, 620.741 418.140, 621.785 415.429 C 624.926 407.265, 626.316 394.713, 625.771 379.426 C 625.317 366.707, 624.952 364.547, 621.560 354.500 C 615.625 336.919, 608.288 324.713, 596.301 312.474 C 589.703 305.738, 580.168 298.691, 574 295.992 C 572.625 295.390, 569.787 294.015, 567.693 292.936 C 561.760 289.876, 547.169 285.196, 540 284.052 C 531.583 282.709, 513.999 282.710, 506.434 284.054 C 483.433 288.139, 460.258 302.646, 441.500 324.702 C 429.557 338.745, 426.560 338.615, 412.949 323.468 C 403.605 313.069, 395.257 305.616, 388.158 301.334 C 376.443 294.267, 371.246 291.535, 365.700 289.529 C 362.290 288.295, 358.825 287.003, 358 286.658 C 351.196 283.810, 328.536 282.099, 318 283.637 M 185.491 491.500 C 185.491 605.350, 185.607 651.777, 185.750 594.670 C 185.893 537.564, 185.893 444.414, 185.750 387.670 C 185.607 330.927, 185.491 377.650, 185.491 491.500 M 664.491 491.500 C 664.491 605.350, 664.607 651.777, 664.750 594.670 C 664.893 537.564, 664.893 444.414, 664.750 387.670 C 664.607 330.927, 664.491 377.650, 664.491 491.500 M 416.500 301 C 420.874 305.400, 424.678 309, 424.953 309 C 425.228 309, 421.874 305.400, 417.500 301 C 413.126 296.600, 409.322 293, 409.047 293 C 408.772 293, 412.126 296.600, 416.500 301 M 528.389 404.250 C 527.979 405.488, 524.461 426.416, 520.572 450.759 L 513.500 495.017 520 501.955 C 523.575 505.770, 529.425 512.717, 533 517.392 C 536.575 522.067, 539.957 525.916, 540.516 525.946 C 541.075 525.976, 546.475 520.802, 552.516 514.448 C 558.557 508.095, 568 498.294, 573.500 492.669 C 582.655 483.306, 605 457.009, 605 455.598 C 605 455.269, 601.164 455, 596.476 455 C 588.412 455, 587.684 454.816, 582.993 451.589 C 580.212 449.676, 577.259 448.383, 576.267 448.646 C 573.981 449.250, 568.261 453.698, 558.004 462.847 C 551.163 468.949, 549.547 469.966, 548.475 468.847 C 547.765 468.106, 545.541 458.500, 543.534 447.500 C 539.024 422.781, 535.402 407.262, 533.445 404.275 C 531.544 401.375, 529.346 401.364, 528.389 404.250 M 322.229 405.397 C 320.899 408.315, 317.426 424.643, 312.953 449 C 309.601 467.258, 308.621 471, 307.193 471 C 306.723 471, 300.178 465.825, 292.650 459.500 C 285.122 453.175, 278.737 448, 278.459 448 C 278.182 448, 276.025 449.780, 273.665 451.955 C 269.533 455.763, 269.090 455.920, 261.646 456.205 L 253.917 456.500 259.401 464.500 C 262.417 468.900, 267.320 475.010, 270.297 478.078 C 273.273 481.146, 276.115 484.382, 276.611 485.269 C 277.527 486.906, 300.637 511.298, 314.254 525 C 323.049 533.850, 344.190 553.696, 352 560.434 C 355.025 563.043, 359.272 566.826, 361.438 568.839 C 363.604 570.853, 367.699 574.300, 370.538 576.500 C 373.376 578.700, 379.480 583.650, 384.101 587.500 C 396.308 597.671, 404.676 604, 405.916 604 C 406.512 604, 407 604.427, 407 604.948 C 407 606.128, 426.833 621.006, 428.376 620.984 C 428.994 620.975, 431.075 619.570, 433 617.862 C 434.925 616.153, 437.625 614.029, 439 613.142 C 440.375 612.254, 444.694 609.047, 448.599 606.014 C 452.503 602.981, 456.721 599.825, 457.971 599 C 459.222 598.175, 460.752 597.044, 461.373 596.486 C 461.993 595.928, 464.525 593.926, 467 592.038 C 471.783 588.389, 472.056 588.166, 478.952 582.292 C 481.400 580.206, 484.100 577.930, 484.952 577.233 C 485.803 576.536, 487.896 574.736, 489.601 573.233 C 491.307 571.730, 494.891 568.700, 497.566 566.500 C 502.378 562.543, 512.412 553.551, 518.803 547.469 L 522.107 544.325 515.404 535.913 C 506.798 525.111, 494.215 510.532, 485.270 501 L 478.232 493.500 472.866 498.522 C 462.007 508.684, 450.204 514.126, 434.452 516.233 C 419.722 518.204, 401.662 514.425, 389.736 506.876 C 382.735 502.445, 372.741 492.829, 368.877 486.808 C 367.152 484.119, 365.316 482.061, 364.798 482.234 C 364.279 482.407, 360.250 488.837, 355.844 496.524 C 347.187 511.628, 344.413 515.340, 343.584 512.933 C 343.313 512.145, 339.695 488.550, 335.544 460.500 C 331.394 432.450, 327.645 408.153, 327.213 406.507 C 326.222 402.725, 323.702 402.164, 322.229 405.397 M 289.500 526 C 292.766 529.300, 295.662 532, 295.937 532 C 296.212 532, 293.766 529.300, 290.500 526 C 287.234 522.700, 284.338 520, 284.063 520 C 283.788 520, 286.234 522.700, 289.500 526 M 560.477 531.250 L 552.500 539.500 560.750 531.523 C 568.412 524.115, 569.456 523, 568.727 523 C 568.576 523, 564.864 526.712, 560.477 531.250 M 310.500 547 C 313.209 549.750, 315.650 552, 315.925 552 C 316.200 552, 314.209 549.750, 311.500 547 C 308.791 544.250, 306.350 542, 306.075 542 C 305.800 542, 307.791 544.250, 310.500 547 M 258.250 766.747 C 264.712 766.921, 275.288 766.921, 281.750 766.747 C 288.212 766.573, 282.925 766.430, 270 766.430 C 257.075 766.430, 251.787 766.573, 258.250 766.747 M 566.250 766.746 C 571.612 766.925, 580.388 766.925, 585.750 766.746 C 591.112 766.566, 586.725 766.419, 576 766.419 C 565.275 766.419, 560.888 766.566, 566.250 766.746 M 431 788.071 C 431 790.354, 441.258 810.041, 446.949 818.679 C 450.241 823.676, 456.401 831.449, 460.637 835.953 L 468.340 844.141 473.420 843.515 C 487.571 841.773, 510.775 837.476, 525.115 833.941 C 550.508 827.682, 584.121 815.910, 584.904 813 C 585.126 812.175, 586.322 808.104, 587.562 803.954 C 588.802 799.803, 590.134 794.291, 590.522 791.704 L 591.227 787 511.114 787 C 454.848 787, 431 787.319, 431 788.071"
                stroke="none"
                fill="#54b383"
                fill-rule="evenodd"
              />
            </g>
          </svg>
          <div className="font-extrabold text-black dark:text-white">
            PRBCare
          </div>
        </div>

        <div className="flex gap-10 items-center text-xl ">
          <div className="md:flex gap-10 items-center text-xl  hidden text-black dark:text-white">
            <Link
              to={"/"}
              className="mx-auto transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/"
                    ? "dark:text-lightGreen text-mainGreen"
                    : ""
                }
              >
                Beranda
              </h1>
            </Link>
            <Link
              to={"/data-puskesmas"}
              className="mx-auto transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/data-puskesmas"
                    ? "dark:text-lightGreen text-mainGreen"
                    : ""
                }
              >
                Puskesmas
              </h1>
            </Link>
            <Link
              to={"/data-apotek"}
              className="mx-auto transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/data-apotek"
                    ? "dark:text-lightGreen text-mainGreen"
                    : ""
                }
              >
                Apotek
              </h1>
            </Link>
            <Link
              to={"/prolanis"}
              className="mx-auto transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/prolanis"
                    ? "dark:text-lightGreen text-mainGreen"
                    : ""
                }
              >
                Prolanis
              </h1>
            </Link>
            <Link
              to={"/artikel"}
              className="mx-auto transition-all flex flex-col items-center justify-center"
            >
              <h1
                className={
                  location.pathname === "/artikel"
                    ? "dark:text-lightGreen text-mainGreen"
                    : ""
                }
              >
                Artikel
              </h1>
            </Link>
          </div>
          <div className="relative flex gap-2 md:gap-2 items-center justify-center">
            <ThemeSwitcher />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  text
                  className="p-1 rounded-full cursor-pointer text-black dark:text-white"
                  severity={`secondary`}
                  onClick={handleClick}
                >
                  <LogIn strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
                  
      <div
        className="bottom-navbar fixed z-50 md:hidden -bottom-1 left-0 right-0 dark:bg-blackHover bg-white dark:text-white p-3 px-4 "
      >
        <div className="flex justify-between items-center">
          <Link
            to={"/"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/" ? "opacity-100" : "opacity-50"
            }`}
          >
            <HomeIcon size={25} />

            <div className="text-sm">Beranda</div>
          </Link>
          <Link
            to={"/data-puskesmas"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/data-puskesmas"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <Hospital size={25} />

            <div className="text-sm">Puskesmas</div>
          </Link>
          <Link
            to={"/data-apotek"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/data-apotek"
                ? "opacity-100"
                : "opacity-50"
            }`}
          >
            <HousePlus size={25} />

            <div className="text-sm">Apotek</div>
          </Link>
          <Link
            to={"/prolanis"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/prolanis" ? "opacity-100" : "opacity-50"
            }`}
          >
            <Calendar size={25} />

            <div className="text-sm">Prolanis</div>
          </Link>
          <Link
            to={"/artikel"}
            className={`flex flex-col items-center justify-center transition-all  ${
              location.pathname === "/artikel" ? "opacity-100" : "opacity-50"
            }`}
          >
            <ScrollText size={25} />

            <div className="text-sm">Artikel</div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavbarPublicPage;

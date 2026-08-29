import fcntl, os, struct

FS_IOC_GETFLAGS = 0x80086601
FS_IOC_SETFLAGS = 0x40086602
FS_IMMUTABLE_FL = 0x00000010
FS_APPEND_FL    = 0x00000020

def get_flags(path):
    fd = os.open(path, os.O_RDONLY | os.O_NONBLOCK)
    try:
        buf = struct.pack('L', 0)
        res = fcntl.ioctl(fd, FS_IOC_GETFLAGS, buf)
        return struct.unpack('L', res)[0]
    finally:
        os.close(fd)

def set_flags(path, flags):
    fd = os.open(path, os.O_RDONLY | os.O_NONBLOCK)
    try:
        fcntl.ioctl(fd, FS_IOC_SETFLAGS, struct.pack('L', flags))
    finally:
        os.close(fd)

for path in ['/tmp', '/var/tmp']:
    fl = get_flags(path)
    print(path, 'avant flags=0x%x' % fl)
    new = fl & ~(FS_IMMUTABLE_FL | FS_APPEND_FL)
    if new != fl:
        set_flags(path, new)
    fl2 = get_flags(path)
    print(path, 'apres  flags=0x%x' % fl2)

print('DONE')
const std = @import("std");

const day1 = @import("./day1/day1.zig");

const RunDayOpts = struct {
    day: u8,
    inputFileName: []const u8,
    part1Fn: ?*const fn ([][]const u8) i32,
    part2Fn: ?*const fn ([][]const u8) i32,
};

const DAY_1_FILE_PATH = "day1_test1.txt";
// const DAY_1_FILE_PATH = "day1.txt";

const dayOptsArr = [_]RunDayOpts{
    .{
        .day = 1,
        .inputFileName = DAY_1_FILE_PATH,
        .part1Fn = &day1.day1Part1,
        .part2Fn = null,
    },
};

pub fn main() !void {
    const allocator = std.heap.page_allocator;
    const bannerPadStr = "~";
    std.debug.print("{s} Advent of Code 2024 [zig] {s}\n", .{ bannerPadStr, bannerPadStr });

    for (dayOptsArr) |dayOpts| {
        std.debug.print("~ Day {d} ~\n", .{dayOpts.day});
        const input_lines = try getInputLines(allocator, dayOpts.inputFileName);
        defer allocator.free(input_lines);

        if (dayOpts.part1Fn) |part1Fn| {
            const part1Res = part1Fn(input_lines);
            std.debug.print("Part 1: {d}\n", .{part1Res});
        }
        if (dayOpts.part2Fn) |part2Fn| {
            const part2Res = part2Fn(input_lines);
            std.debug.print("Part 2: {d}\n", .{part2Res});
        }
    }
}

fn getInputLines(allocator: std.mem.Allocator, file_name: []const u8) ![][]const u8 {
    const cwd = try std.fs.cwd().realpathAlloc(allocator, ".");
    defer allocator.free(cwd);

    const file_path = try std.fs.path.join(allocator, &[_][]const u8{ cwd, "input", file_name });
    var file = try std.fs.openFileAbsolute(file_path, .{ .mode = .read_only });
    defer file.close();

    const file_stat = try file.stat();
    const buf = try allocator.alloc(u8, file_stat.size);

    _ = try file.readAll(buf);
    var lines = std.ArrayList([]const u8).init(allocator);
    errdefer lines.deinit();

    var line_it = std.mem.split(u8, buf, "\n");
    while (line_it.next()) |line| {
        try lines.append(line);
    }
    const lines_slice = try lines.toOwnedSlice();
    return lines_slice;
    // const file = try std.fs.cwd().openFile("input" + std.fs.se + file_path, flags: File.OpenFlags)
}

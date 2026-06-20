"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageEventEntity = void 0;
const typeorm_1 = require("typeorm");
const page_entity_1 = require("./page.entity");
const page_event_types_1 = require("./page-event.types");
let PageEventEntity = class PageEventEntity {
};
exports.PageEventEntity = PageEventEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], PageEventEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PageEventEntity.prototype, "pageId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => page_entity_1.PageEntity, (page) => page.events, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'pageId' }),
    __metadata("design:type", page_entity_1.PageEntity)
], PageEventEntity.prototype, "page", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], PageEventEntity.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PageEventEntity.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-json', { nullable: true }),
    __metadata("design:type", Object)
], PageEventEntity.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PageEventEntity.prototype, "createdAt", void 0);
exports.PageEventEntity = PageEventEntity = __decorate([
    (0, typeorm_1.Entity)('page_events')
], PageEventEntity);
//# sourceMappingURL=page-event.entity.js.map